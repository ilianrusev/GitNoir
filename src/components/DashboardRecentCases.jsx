import SingleCase from "./SingleCase";

export default function DashboardRecentCases({
  recentCases,
  getCaseStatus,
  checkUnlocked,
  progress,
}) {
  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4">
          YOUR CASES
        </p>
        <h2 className="font-typewriter text-2xl text-[#e5e5e5] mb-6">
          RECENT INVESTIGATIONS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentCases.map((caseData, index) => {
          const status = getCaseStatus(caseData);
          const unlocked = checkUnlocked(caseData);
          const caseProgress = progress?.case_progress?.[caseData.id];

          return (
            <SingleCase
              key={caseData.id}
              caseData={caseData}
              status={status}
              unlocked={unlocked}
              caseProgress={caseProgress}
              animationDelay={`${index * 0.1}s`}
            />
          );
        })}
      </div>
    </>
  );
}
