import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SecondaryHeader({
  backTo,
  backLabel,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-8">
      {backTo && backLabel && (
        <Link
          to={backTo}
          className="flex items-center gap-2 text-(--foreground-muted) mb-4 hover:text-(--primary) transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">{backLabel}</span>
        </Link>
      )}

      <p className="font-mono text-xs tracking-[0.3em] mb-2 text-(--primary)">
        {eyebrow}
      </p>
      <h1 className="font-typewriter text-(--foreground) text-4xl">{title}</h1>

      {description && (
        <p className="max-w-2xl text-(--foreground-muted) mt-2">{description}</p>
      )}
    </div>
  );
}
