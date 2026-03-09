import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Terminal, ArrowLeft, Info, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { toast } from "sonner";
import {
  isPasswordPolicyValid,
  PASSWORD_POLICY_MESSAGE,
} from "../services/authService";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!isPasswordPolicyValid(password)) {
      toast.error(PASSWORD_POLICY_MESSAGE);
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

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await loginWithGoogle();

      if (result?.user) {
        if (result.isNewUser) {
          toast.success("Badge created! Welcome to the agency, Detective.");
        } else {
          toast.success("Welcome back, Detective!");
        }
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
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-(--background-terminal) items-center justify-center border-r border-(--border) relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('/night-town.jpeg')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-(--background-terminal)" />

        <div className="relative z-10 p-12 max-w-lg">
          <h2 className="font-typewriter text-4xl text-(--foreground) mb-6">
            BECOME A<br />
            <span className="text-(--primary)">GIT DETECTIVE</span>
          </h2>
          <p className="text-(--foreground-muted) leading-relaxed mb-8">
            Join the agency. Learn to track commits, merge evidence, and solve
            the most complex version control mysteries.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-(--foreground-terminal)" />
              <span className="text-sm text-(--foreground-muted)">
                Many mystery cases to solve
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-(--primary)" />
              <span className="text-sm text-(--foreground-muted)">
                Earn reputation points
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-(--accent)" />
              <span className="text-sm text-(--foreground-muted)">
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
            CREATE YOUR BADGE
          </h1>
          <p className="text-(--foreground-muted) mb-8">
            Register to start your investigation career.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="font-mono text-xs text-(--foreground-muted) tracking-wider"
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
                data-testid="register-email-input"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="password"
                  className="font-mono text-xs text-(--foreground-muted) tracking-wider"
                >
                  PASSWORD
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="Password policy"
                      className="text-(--foreground-muted) hover:text-(--primary) transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="max-w-72 border-(--border) bg-(--background-paper) p-3 text-(--foreground)"
                  >
                    <p className="text-sm leading-relaxed">
                      {PASSWORD_POLICY_MESSAGE}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-terminal w-full pr-10"
                  placeholder="••••••••"
                  minLength={6}
                  required
                  data-testid="register-password-input"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-(--foreground-muted) hover:text-(--primary) transition-colors"
                  data-testid="register-password-visibility-btn"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-mono text-xs text-(--foreground-muted) tracking-wider"
              >
                CONFIRM PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-terminal w-full pr-10"
                  placeholder="••••••••"
                  minLength={6}
                  required
                  data-testid="register-confirm-password-input"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-(--foreground-muted) hover:text-(--primary) transition-colors"
                  data-testid="register-confirm-password-visibility-btn"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
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
                <span className="bg-(--background) px-4 text-[#666] font-mono">
                  OR
                </span>
              </div>
            </div>

            <GoogleAuthButton
              onClick={handleGoogleLogin}
              disabled={loading}
              dataTestId="google-register-btn"
            />
          </form>

          <p className="mt-8 text-center text-sm text-(--foreground-muted)">
            Already have a detective badge?{" "}
            <Link
              to="/login"
              className="text-(--primary) hover:underline"
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
