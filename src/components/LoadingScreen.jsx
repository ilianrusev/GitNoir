export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--background)">
      <div className="terminal-text text-lg animate-pulse-glow">{message}</div>
    </div>
  );
}