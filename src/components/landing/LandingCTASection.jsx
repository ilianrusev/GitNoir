import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function LandingCTASection() {
  return (
    <section className="py-24 px-6 bg-(--background-terminal) border-y border-(--border)">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-typewriter text-3xl md:text-5xl text-(--foreground) mb-6">
          THE CITY NEEDS YOU,
          <br />
          <span className="text-(--primary)">DETECTIVE.</span>
        </h2>
        <p className="text-lg text-(--foreground-muted) mb-10">
          Join thousands of developers mastering Git through mystery and
          intrigue.
        </p>
        <Link to="/register">
          <Button
            className="btn-primary text-base px-10 py-4"
            data-testid="cta-register-btn"
          >
            Create Your Badge
          </Button>
        </Link>
      </div>
    </section>
  );
}