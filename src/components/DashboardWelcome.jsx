export default function DashboardWelcome({ username }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-2">
        DETECTIVE PROFILE
      </p>
      <h1 className="font-typewriter text-4xl text-[#e5e5e5] mb-2">
        WELCOME, <span className="text-[#ffb703]">{username}</span>
      </h1>
      <p className="text-[#a3a3a3]">
        Your reputation speaks for itself. What case will you crack today?
      </p>
    </div>
  );
}
