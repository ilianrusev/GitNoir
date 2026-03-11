import SingleCase from "./SingleCase";
import {
  getCaseStatus,
  getCaseUnlockHint,
} from "../../services/caseStatusService";

export default function CasesGrid({
  filterCases,
  progress,
  variant,
  allCases,
}) {
  const gridClassName =
    variant === "cases"
      ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  const statusCases = allCases || filterCases;

  return (
    <div className={gridClassName}>
      {filterCases.map((caseData, index) => {
        const status = getCaseStatus(caseData, progress, statusCases);
        const caseProgress = progress?.case_progress?.[caseData.id];
        const lockHint = getCaseUnlockHint(caseData, progress, statusCases);

        return (
          <SingleCase
            key={caseData.id}
            caseData={caseData}
            status={status}
            caseProgress={caseProgress}
            lockHint={lockHint}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
