import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      toast.success("Badge created! Welcome to the agency, Detective.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Integrate Google OAuth later
    toast.info("Google login coming soon! Use email/password for now.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#0c0c0c] items-center justify-center border-r border-[#333] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1635931225069-4968458f04f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxkZXRlY3RpdmUlMjBub2lyJTIwY2l0eSUyMG5pZ2h0fGVufDB8fHx8MTc3MjgzMzY2OXww&ixlib=rb-4.1.0&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c0c0c]" />

        <div className="relative z-10 p-12 max-w-lg">
          <h2 className="font-typewriter text-4xl text-[#e5e5e5] mb-6">
            BECOME A<br />
            <span className="text-[#ffb703]">GIT DETECTIVE</span>
          </h2>
          <p className="text-[#a3a3a3] leading-relaxed mb-8">
            Join the agency. Learn to track commits, merge evidence, and solve
            the most complex version control mysteries.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00ff41]" />
              <span className="text-sm text-[#a3a3a3]">
                5 mystery cases to solve
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#ffb703]" />
              <span className="text-sm text-[#a3a3a3]">
                Earn reputation points
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d00000]" />
              <span className="text-sm text-[#a3a3a3]">
                Climb the leaderboard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#a3a3a3] mb-12 hover:text-[#ffb703] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to HQ</span>
        </Link>

        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-8 h-8 text-[#00ff41]" />
            <span className="font-typewriter text-2xl text-[#ffb703]">
              GIT NOIR
            </span>
          </div>

          <h1 className="font-typewriter text-3xl text-[#e5e5e5] mb-2">
            CREATE YOUR BADGE
          </h1>
          <p className="text-[#a3a3a3] mb-8">
            Register to start your investigation career.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="font-mono text-xs text-[#a3a3a3] tracking-wider"
              >
                DETECTIVE NAME
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-terminal w-full"
                placeholder="SherlockGit"
                minLength={3}
                maxLength={50}
                required
                data-testid="register-username-input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-mono text-xs text-[#a3a3a3] tracking-wider"
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
                data-testid="register-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-mono text-xs text-[#a3a3a3] tracking-wider"
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
                minLength={6}
                required
                data-testid="register-password-input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-mono text-xs text-[#a3a3a3] tracking-wider"
              >
                CONFIRM PASSWORD
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-terminal w-full"
                placeholder="••••••••"
                minLength={6}
                required
                data-testid="register-confirm-password-input"
              />
            </div>

            <Button
              type="submit"
              className="btn-primary w-full mt-8"
              disabled={loading}
              data-testid="register-submit-btn"
            >
              {loading ? "Creating Badge..." : "Join The Agency"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0a0a] px-4 text-[#666] font-mono">
                  OR
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-[#1a1a1a] border border-[#333] text-[#e5e5e5] hover:border-[#ffb703] hover:bg-[#1a1a1a] font-mono uppercase tracking-wider text-sm py-3 flex items-center justify-center gap-3"
              data-testid="google-register-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#a3a3a3]">
            Already have a badge?{" "}
            <Link
              to="/login"
              className="text-[#ffb703] hover:underline"
              data-testid="register-login-link"
            >
              Access files
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
