import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function LandingHeroSection({ user }) {
  return (
    <section className="hero-section">
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url('/night-town.jpeg')`,
        }}
      />
      <div className="hero-overlay" />
      <div className="hero-content -translate-y-10 md:-translate-y-10">
        <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
          CASE FILE #001 - ACTIVE
        </p>
        <h1 className="font-typewriter text-5xl md:text-7xl text-(--foreground) mb-6 leading-tight">
          LEARN GIT.
          <br />
          <span className="text-(--primary)">SOLVE MYSTERIES.</span>
        </h1>
        <p className="text-lg md:text-xl text-(--foreground-muted) max-w-xl mb-10 leading-relaxed">
          Every commit tells a story. Every branch holds a clue. Master Git
          commands by solving detective cases in this noir-themed learning
          adventure.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register">
            <Button
              className="btn-primary text-base px-8 py-4"
              data-testid="hero-start-btn"
            >
              Begin Investigation
            </Button>
          </Link>
          {user && (
            <Link to="/leaderboard">
              <Button
                className="btn-outline text-base px-8 py-4"
                data-testid="hero-leaderboard-btn"
              >
                View Detectives
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}