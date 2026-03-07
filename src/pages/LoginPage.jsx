import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12">
        <Link to="/" className="flex items-center gap-2 text-[#a3a3a3] mb-12 hover:text-[#ffb703] transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to HQ</span>
        </Link>

        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-8 h-8 text-[#00ff41]" />
            <span className="font-typewriter text-2xl text-[#ffb703]">GIT NOIR</span>
          </div>

          <h1 className="font-typewriter text-3xl text-[#e5e5e5] mb-2">
            WELCOME BACK
          </h1>
          <p className="text-[#a3a3a3] mb-8">
            Enter your credentials to access your case files.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs text-[#a3a3a3] tracking-wider">
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
              <Label htmlFor="password" className="font-mono text-xs text-[#a3a3a3] tracking-wider">
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
                <div className="w-full border-t border-[#333]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0a0a] px-4 text-[#666] font-mono">OR</span>
              </div>
            </div>

            <Button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-[#1a1a1a] border border-[#333] text-[#e5e5e5] hover:border-[#ffb703] hover:bg-[#1a1a1a] font-mono uppercase tracking-wider text-sm py-3 flex items-center justify-center gap-3"
              disabled={loading}
              data-testid="google-login-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#a3a3a3]">
            New to the agency?{" "}
            <Link to="/register" className="text-[#ffb703] hover:underline" data-testid="login-register-link">
              Create your badge
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#0c0c0c] items-center justify-center border-l border-[#333] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1608742213509-815b97c30b36?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxoYWNrZXIlMjBjb21wdXRlciUyMHRlcm1pbmFsJTIwY29kZXxlbnwwfHx8fDE3NzI4MzM2NzV8MA&ixlib=rb-4.1.0&q=85')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
        
        <div className="relative z-10 p-12 max-w-md">
          <div className="terminal-container p-6">
            <div className="terminal-header mb-4">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-3 text-[#666]">detective-terminal</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-[#666]">$ git status</p>
              <p className="terminal-text">On branch investigation</p>
              <p className="terminal-text">Your case awaits...</p>
              <p className="text-[#666] animate-blink">$ _</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
