import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

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

function normalizeFileName(filePath) {
  return path.basename(filePath).trim().toLocaleLowerCase();
}

function normalizeOutputLines(value) {
  if (typeof value === "string") {
    return value === "" ? [] : [value];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

function validateTerminalOutputRules(parsed) {
  const issues = [];

  parsed.steps.forEach((step, index) => {
    const stepPath = `/steps/${index}`;
    const expectedCommands = Array.isArray(step.expected_commands)
      ? step.expected_commands
      : [];

    const hasTerminalOutput = Object.hasOwn(step, "terminal_output");
    const hasOutputByCommand = Object.hasOwn(step, "terminal_output_by_command");

    if (hasTerminalOutput) {
      issues.push(
        `${stepPath} uses deprecated terminal_output; use terminal_output_by_command only`,
      );
    }

    if (!hasOutputByCommand) {
      return;
    }

    const map = step.terminal_output_by_command;
    const expectedSet = new Set(expectedCommands);
    const mapKeys = Object.keys(map || {});

    if (expectedCommands.length === 0) {
      issues.push(`${stepPath} has terminal_output_by_command but no expected_commands`);
    }

    for (const command of expectedCommands) {
      if (!Object.hasOwn(map, command)) {
        issues.push(
          `${stepPath}/terminal_output_by_command is missing key for expected command: ${command}`,
        );
      }
    }

    for (const key of mapKeys) {
      if (!expectedSet.has(key)) {
        issues.push(
          `${stepPath}/terminal_output_by_command has key not present in expected_commands: ${key}`,
        );
      }

      const lines = normalizeOutputLines(map[key]);
      lines.forEach((line, lineIndex) => {
        if (typeof line !== "string") {
          issues.push(
            `${stepPath}/terminal_output_by_command/${key}/${lineIndex} must be a string`,
          );
        }
      });
    }
  });

  return issues;
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
  addFormats(ajv);

  ajv.addSchema(stepSchema, stepSchema.$id);
  const validateCase = ajv.compile(caseSchema);

  const caseFiles = await listCaseFiles(casesRootDir);

  if (!caseFiles.length) {
    console.error("No case JSON files were found under src/data/cases.");
    process.exit(1);
  }

  let hasFailures = false;
  const fileNames = new Map();

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

    const stepsPointsTotal = parsed.steps.reduce(
      (sum, step) => sum + step.points,
      0,
    );

    if (parsed.total_points !== stepsPointsTotal) {
      hasFailures = true;
      console.error(
        `\n✖ ${toRelative(filePath)} has inconsistent total_points`,
      );
      console.error(`  - total_points: ${parsed.total_points}`);
      console.error(`  - sum of steps[].points: ${stepsPointsTotal}`);
      continue;
    }

    const terminalOutputIssues = validateTerminalOutputRules(parsed);
    if (terminalOutputIssues.length > 0) {
      hasFailures = true;
      console.error(
        `\n✖ ${toRelative(filePath)} has invalid terminal output definitions`,
      );
      for (const issue of terminalOutputIssues) {
        console.error(`  - ${issue}`);
      }
      continue;
    }

    const normalizedFileName = normalizeFileName(filePath);
    const firstSeen = fileNames.get(normalizedFileName);

    if (firstSeen) {
      hasFailures = true;
      console.error(
        `\n✖ ${toRelative(filePath)} has a duplicate file name`,
      );
      console.error(`  - file name: "${path.basename(filePath)}"`);
      console.error(`  - already used by: ${toRelative(firstSeen.filePath)}`);
      continue;
    }

    fileNames.set(normalizedFileName, {
      filePath,
    });
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
