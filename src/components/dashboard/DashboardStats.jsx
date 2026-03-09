export default function DashboardStats({ reputation, completedCount, totalCases }) {
  const completionPercent =
    totalCases > 0 ? Math.round((completedCount / totalCases) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="stat-card" data-testid="stat-reputation">
        <div className="stat-value">{reputation}</div>
        <div className="stat-label">Reputation</div>
      </div>
      <div className="stat-card" data-testid="stat-cases-solved">
        <div className="stat-value">{completedCount}</div>
        <div className="stat-label">Cases Solved</div>
      </div>
      <div className="stat-card" data-testid="stat-total-cases">
        <div className="stat-value">{totalCases}</div>
        <div className="stat-label">Total Cases</div>
      </div>
      <div className="stat-card" data-testid="stat-progress">
        <div className="stat-value">{completionPercent}%</div>
        <div className="stat-label">Completion</div>
      </div>
    </div>
  );
}
