import SingleCase from "./SingleCase";
import { getCaseStatus } from "../../services/caseStatusService";

export default function CasesGrid({ cases, progress, variant }) {
  const gridClassName =
    variant === "cases"
      ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClassName}>
      {cases.map((caseData, index) => {
        const status = getCaseStatus(caseData, progress);
        const caseProgress = progress?.case_progress?.[caseData.id];

        return (
          <SingleCase
            key={caseData.id}
            caseData={caseData}
            status={status}
            caseProgress={caseProgress}
            animationDelay={`${index * 0.1}s`}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
