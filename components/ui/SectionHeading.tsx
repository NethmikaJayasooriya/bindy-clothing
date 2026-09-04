import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  italicWord?: string;
  italicPosition?: "end" | "middle" | "start";
  description?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  italicWord,
  description,
  align = "center",
  action,
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  // Build the title with the italicized accent word if provided
  const renderTitle = () => {
    if (!italicWord) {
      return <span>{title}</span>;
    }

    const parts = title.split(italicWord);
    if (parts.length === 1) {
      return (
        <>
          {title}{" "}
          <span className="font-editorial-italic font-light text-gold">
            {italicWord}
          </span>
        </>
      );
    }

    return (
      <>
        {parts[0]}
        <span className="font-editorial-italic font-light text-gold">
          {italicWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={`mb-12 sm:mb-16 ${
        isCenter ? "text-center max-w-3xl mx-auto" : "flex flex-col md:flex-row md:items-end justify-between gap-6"
      } ${className}`}
    >
      <div className={`space-y-3.5 ${isCenter ? "" : "max-w-2xl"}`}>
        {eyebrow && (
          <div
            className={`inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold ${
              isCenter ? "justify-center" : ""
            }`}
          >
            {eyebrowIcon && <span className="shrink-0">{eyebrowIcon}</span>}
            <span>{eyebrow}</span>
          </div>
        )}

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-charcoal-rich font-light tracking-wide leading-[1.15]">
          {renderTitle()}
        </h2>

        {description && (
          <p className="font-serif italic text-base sm:text-lg text-muted font-light leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {!isCenter && action && (
        <div className="self-start md:self-end shrink-0 pb-1">{action}</div>
      )}
    </div>
  );
}
