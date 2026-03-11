import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back, Detective!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await loginWithGoogle();

      if (result?.user) {
        toast.success("Welcome back, Detective!");
        navigate("/dashboard");
        return;
      }

      toast.info("Redirecting to Google sign-in...");
    } catch (error) {
      toast.error(error.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--background) flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-(--foreground-muted) mb-12 hover:text-(--primary) transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to HQ</span>
        </Link>

        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-8 h-8 text-(--foreground-terminal)" />
            <span className="font-typewriter text-2xl text-(--primary)">
              GIT NOIR
            </span>
          </div>

          <h1 className="font-typewriter text-3xl text-(--foreground) mb-2">
            WELCOME BACK
          </h1>
          <p className="text-(--foreground-muted) mb-8">
            Enter your credentials to access your case files.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-mono text-xs text-(--foreground-muted) tracking-wider"
              >
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-terminal w-full"
                placeholder="detective@agency.com"
                required
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-mono text-xs text-(--foreground-muted) tracking-wider"
              >
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-terminal w-full"
                placeholder="••••••••"
                required
                data-testid="login-password-input"
              />
            </div>

            <Button
              type="submit"
              className="btn-primary w-full mt-8"
              disabled={loading}
              data-testid="login-submit-btn"
            >
              {loading ? "Authenticating..." : "Access Files"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-(--border)"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-(--background) px-4 text-(--foreground-muted) font-mono">
                  OR
                </span>
              </div>
            </div>

            <GoogleAuthButton
              onClick={handleGoogleLogin}
              disabled={loading}
              dataTestId="google-login-btn"
            />
          </form>

          <p className="mt-8 text-center text-sm text-(--foreground-muted)">
            New to the agency?{" "}
            <Link
              to="/register"
              className="text-(--primary) hover:underline"
              data-testid="login-register-link"
            >
              Create your detective badge
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-(--background-terminal) items-center justify-center border-l border-(--border) relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('/matrix-code.jpeg')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--background-terminal) to-transparent" />

        <div className="relative z-10 p-12 max-w-md">
          <div className="terminal-container p-6">
            <div className="terminal-header mb-4">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-3 text-(--foreground-muted)">
                detective-terminal
              </span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-(--foreground-muted)">$ git status</p>
              <p className="terminal-text">On branch investigation</p>
              <p className="terminal-text">Your case awaits...</p>
              <p className="text-(--foreground-muted) animate-blink">$ _</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
