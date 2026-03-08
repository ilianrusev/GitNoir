export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="terminal-text text-lg animate-pulse-glow">{message}</div>
    </div>
  );
}