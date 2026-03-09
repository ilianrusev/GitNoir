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
          className="flex items-center gap-2 text-[#a3a3a3] mb-4 hover:text-[#ffb703] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">{backLabel}</span>
        </Link>
      )}

      <p className="font-mono text-xs tracking-[0.3em] mb-2 text-[#ffb703]">
        {eyebrow}
      </p>
      <h1 className="font-typewriter text-[#e5e5e5] text-4xl">{title}</h1>

      {description && (
        <p className="max-w-2xl text-[#a3a3a3] mt-2">{description}</p>
      )}
    </div>
  );
}
