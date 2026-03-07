import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, "src", "data");
const schemasDir = path.join(dataDir, "schemas");
const casesRootDir = path.join(dataDir, "cases");

function toRelative(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function listCaseFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listCaseFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatErrors(errors = []) {
  return errors
    .map((error) => {
      const pathPart = error.instancePath || "(root)";
      return `  - ${pathPart} ${error.message}`;
    })
    .join("\n");
}

async function main() {
  const stepSchemaPath = path.join(schemasDir, "step.schema.json");
  const caseSchemaPath = path.join(schemasDir, "case.schema.json");

  const [stepSchema, caseSchema] = await Promise.all([
    readJson(stepSchemaPath),
    readJson(caseSchemaPath),
  ]);

  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
  });

  ajv.addSchema(stepSchema, stepSchema.$id);
  const validateCase = ajv.compile(caseSchema);

  const caseFiles = await listCaseFiles(casesRootDir);

  if (!caseFiles.length) {
    console.error("No case JSON files were found under src/data/cases.");
    process.exit(1);
  }

  let hasFailures = false;

  for (const filePath of caseFiles.sort()) {
    let parsed;

    try {
      parsed = await readJson(filePath);
    } catch (error) {
      hasFailures = true;
      console.error(`\n✖ ${toRelative(filePath)}: invalid JSON`);
      console.error(`  - ${(error && error.message) || String(error)}`);
      continue;
    }

    const isValid = validateCase(parsed);

    if (!isValid) {
      hasFailures = true;
      console.error(`\n✖ ${toRelative(filePath)} failed schema validation`);
      console.error(formatErrors(validateCase.errors));
      continue;
    }
  }

  if (hasFailures) {
    console.error("\nCase validation failed.");
    process.exit(1);
  }

  console.log(`✓ Validated ${caseFiles.length} case files successfully.`);
}

main().catch((error) => {
  console.error("Case validation script crashed.");
  console.error(error);
  process.exit(1);
});
