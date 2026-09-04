"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Check,
  ThumbsUp,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  X,
  Filter,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { type Review, type Product } from "@/lib/products";

interface ReviewsSectionProps {
  product: Product;
}

type SortOption = "recent" | "highest" | "lowest" | "helpful";
type FilterType = "all" | "verified" | "photos";

function StarRating({
  rating,
  className = "w-3.5 h-3.5",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${className} ${
            star <= Math.round(rating)
              ? "fill-gold text-gold"
              : "text-sand/30 fill-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-AU", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

// Largest-remainder distribution so fit percentages always sum to exactly 100%
function calculateFitPercentages(
  counts: { small: number; true: number; large: number },
  total: number
): { small: number; true: number; large: number } {
  if (total === 0) return { small: 0, true: 100, large: 0 };

  const entries: {
    key: "small" | "true" | "large";
    exact: number;
    floor: number;
    remainder: number;
  }[] = [
    {
      key: "small",
      exact: (counts.small / total) * 100,
      floor: Math.floor((counts.small / total) * 100),
      remainder: 0,
    },
    {
      key: "true",
      exact: (counts.true / total) * 100,
      floor: Math.floor((counts.true / total) * 100),
      remainder: 0,
    },
    {
      key: "large",
      exact: (counts.large / total) * 100,
      floor: Math.floor((counts.large / total) * 100),
      remainder: 0,
    },
  ];

  entries.forEach((e) => {
    e.remainder = e.exact - e.floor;
  });

  const sumFloor = entries.reduce((sum, e) => sum + e.floor, 0);
  const remainderToDistribute = 100 - sumFloor;

  // Distribute 1% to the largest decimal remainders
  entries.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < remainderToDistribute; i++) {
    entries[i % entries.length].floor += 1;
  }

  const result: Record<"small" | "true" | "large", number> = {
    small: 0,
    true: 0,
    large: 0,
  };
  entries.forEach((e) => {
    result[e.key] = e.floor;
  });

  return result;
}

export default function ReviewsSection({ product }: ReviewsSectionProps) {
  const reviews: Review[] = product.reviews;

  // Sorting & Filtering States
  const [sortBy, setSortBy] = useState<SortOption>("helpful");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(4);

  // Helpful votes state (keyed by review id)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  // Main Sub-Tab: Reviews vs Q&A
  const [mainTab, setMainTab] = useState<"reviews" | "qa">("reviews");
  const [qaSearch, setQaSearch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Lightbox Modal for Photo viewing
  const [activePhoto, setActivePhoto] = useState<{
    url: string;
    reviewTitle: string;
    reviewer: string;
  } | null>(null);

  // Calculate Metrics
  const totalCount = reviews.length;
  const avgRating = useMemo(() => {
    if (totalCount === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / totalCount;
  }, [reviews, totalCount]);

  // Breakdown by stars (5 down to 1)
  const ratingDistribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star] || 0,
      percentage: totalCount > 0 ? Math.round(((counts[star] || 0) / totalCount) * 100) : 0,
    }));
  }, [reviews, totalCount]);

  // Fit Feedback Analysis (exact 100% sum via largest remainder)
  const fitMetrics = useMemo(() => {
    const counts = { small: 0, true: 0, large: 0 };
    reviews.forEach((r) => {
      counts[r.fit] = (counts[r.fit] || 0) + 1;
    });
    return calculateFitPercentages(counts, totalCount);
  }, [reviews, totalCount]);

  // Find Featured Review (single review with highest helpful count)
  const featuredReview = useMemo(() => {
    if (reviews.length === 0) return null;
    return [...reviews].sort((a, b) => b.helpfulCount - a.helpfulCount)[0];
  }, [reviews]);

  // Handle Helpful Vote
  const handleVoteHelpful = (reviewId: string) => {
    if (userVoted[reviewId]) return;
    setUserVoted((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  // Whether the featured story spotlight block is actively rendered
  const isFeaturedBlockVisible = Boolean(featuredReview && !starFilter && filterType === "all");

  // Filtered & Sorted Reviews
  // When the featured story block is visible, exclude that review from the grid below to avoid duplicate rendering.
  // When a filter is active, include the featured review so it is not lost if it matches the filter.
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (isFeaturedBlockVisible && featuredReview && r.id === featuredReview.id) {
          return false;
        }
        if (filterType === "verified" && !r.verified) return false;
        if (filterType === "photos" && (!r.photos || r.photos.length === 0)) return false;
        if (starFilter !== null && Math.round(r.rating) !== starFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const helpfulA = a.helpfulCount + (helpfulVotes[a.id] || 0);
        const helpfulB = b.helpfulCount + (helpfulVotes[b.id] || 0);

        if (sortBy === "helpful") return helpfulB - helpfulA;
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest") return a.rating - b.rating;
        if (sortBy === "recent") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
  }, [reviews, isFeaturedBlockVisible, featuredReview, filterType, starFilter, sortBy, helpfulVotes]);

  // Default Q&As for garment inquiry
  const defaultQAs = [
    {
      q: "Is the fabric sheer / does it require a slip?",
      a: "The piece is fully lined with lightweight organic cotton voile through both the structured bodice and skirt tiers, providing complete opacity without adding extra bulk or warmth.",
      author: "Eleanor W.",
      date: "August 2026",
    },
    {
      q: "How does the bust fit on larger cup sizes?",
      a: "The front princess seams are shaped to contour natural bust curves, and the hidden elastic back shirring panel offers flexibility for cup sizes B through DD. If you are E+, we advise sizing up one size.",
      author: "Priya S.",
      date: "July 2026",
    },
    {
      q: "Can this dress be hemmed without losing the cutwork scallop hem?",
      a: "Because the scallop cutwork is engineered directly into the lower hem tier, we recommend shortening from the middle tier seam rather than cutting the scalloped edge.",
      author: "Hannah M.",
      date: "June 2026",
    },
    {
      q: "How should I wash and care for the mother-of-pearl buttons?",
      a: "Natural mother-of-pearl shell is durable and water-safe. Turn the garment inside out or place it inside a cotton wash bag to protect against machine drum friction.",
      author: "Clara T.",
      date: "May 2026",
    },
  ];

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  return (
    <section
      id="reviews-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-sand/40 text-charcoal"
    >
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gold text-[11px] font-sans uppercase tracking-[0.3em] mb-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Stories & Questions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-charcoal">
            Loved by Our Community
          </h2>
        </div>
        <p className="font-serif italic text-sm sm:text-base text-muted max-w-md">
          Honest stories, occasion notes, and mindful fit feedback from women wearing BINDY across
          Australia and beyond.
        </p>
      </div>

      {/* SUB-TAB SELECTOR: Customer Reviews vs Questions & Answers */}
      <div className="flex items-center gap-3 mb-10 border-b border-sand/40 pb-4">
        <button
          type="button"
          onClick={() => setMainTab("reviews")}
          className={`px-6 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer ${
            mainTab === "reviews"
              ? "bg-charcoal text-paper-light shadow-md"
              : "bg-paper-light border border-sand/50 text-charcoal hover:border-gold hover:text-gold"
          }`}
        >
          Customer Reviews ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setMainTab("qa")}
          className={`px-6 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer ${
            mainTab === "qa"
              ? "bg-charcoal text-paper-light shadow-md"
              : "bg-paper-light border border-sand/50 text-charcoal hover:border-gold hover:text-gold"
          }`}
        >
          Questions & Answers ({defaultQAs.length})
        </button>
      </div>

      {mainTab === "qa" ? (
        <div className="space-y-8">
          {/* Ask question & search box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-3xl bg-paper-light border border-sand/40">
            <input
              type="text"
              value={qaSearch}
              onChange={(e) => setQaSearch(e.target.value)}
              placeholder="Search existing questions..."
              className="px-4 py-2.5 rounded-full border border-sand/50 bg-paper text-xs font-sans text-charcoal focus:outline-none focus:border-gold max-w-sm"
            />
            <button
              type="button"
              onClick={() => setNewQuestion(newQuestion ? "" : "open")}
              className="px-6 py-2.5 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white text-xs font-sans uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              Ask a Question
            </button>
          </div>

          {/* Ask question form */}
          {newQuestion && (
            <div className="p-6 rounded-3xl bg-paper-light border border-gold/40 shadow-luxury space-y-4 max-w-xl">
              <h4 className="font-serif text-lg font-medium text-charcoal">
                Ask a Question About {product.name}
              </h4>
              <textarea
                placeholder="Ask about fabric weight, bust ease, hemming, or styling..."
                rows={3}
                className="w-full p-3 rounded-2xl border border-sand/60 bg-paper text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewQuestion("")}
                  className="px-4 py-2 text-xs font-sans uppercase tracking-wider text-muted hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuestionSubmitted(true);
                    setTimeout(() => {
                      setQuestionSubmitted(false);
                      setNewQuestion("");
                    }, 2000);
                  }}
                  className="px-6 py-2 rounded-full bg-gold text-charcoal text-xs font-sans uppercase tracking-wider font-semibold hover:bg-cinnamon hover:text-white transition-colors cursor-pointer"
                >
                  {questionSubmitted ? "Submitted!" : "Submit Question"}
                </button>
              </div>
            </div>
          )}

          {/* Q&A Accordion List */}
          <div className="space-y-4">
            {defaultQAs
              .filter(
                (item) =>
                  !qaSearch ||
                  item.q.toLowerCase().includes(qaSearch.toLowerCase()) ||
                  item.a.toLowerCase().includes(qaSearch.toLowerCase())
              )
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-paper-light border border-sand/40 shadow-sm space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-sand/30 flex items-center justify-center font-serif text-xs font-bold text-charcoal shrink-0">
                      Q
                    </span>
                    <h4 className="font-serif text-base text-charcoal font-medium">
                      {item.q}
                    </h4>
                  </div>
                  <div className="flex items-start gap-3 pl-9">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-gold font-semibold">
                          Answered by BINDY Atelier Team
                        </span>
                        <span className="text-[10px] text-muted">• {item.date}</span>
                      </div>
                      <p className="text-xs font-sans text-charcoal/85 leading-relaxed font-light">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <>

      {/* 2. RATING SUMMARY BLOCK (Light Luxury Surface) */}
      <div className="bg-paper-light border border-sand/40 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-paper-card mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Overall Average Score (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-sand/30 pb-8 lg:pb-0 lg:pr-8">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl sm:text-6xl font-light text-charcoal-rich">
                {avgRating.toFixed(1)}
              </span>
              <span className="font-sans text-sm uppercase tracking-widest text-muted font-medium">
                / 5.0
              </span>
            </div>

            <div className="mt-3">
              <StarRating rating={avgRating} className="w-5 h-5" />
            </div>

            <p className="mt-2 font-sans text-xs uppercase tracking-widest text-muted font-medium">
              Based on {totalCount} verified community reviews
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage/15 border border-sage/40 text-charcoal text-[11px] font-sans tracking-wider font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
              <span>100% Authentic Customer Feedback</span>
            </div>
          </div>

          {/* Center: Star Rating Breakdown Bar Chart (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            <p className="text-[10px] font-sans uppercase tracking-[0.28em] text-muted mb-3 font-semibold">
              Rating Distribution
            </p>
            {ratingDistribution.map(({ star, count, percentage }) => {
              const isSelected = starFilter === star;
              return (
                <button
                  key={star}
                  onClick={() => setStarFilter(isSelected ? null : star)}
                  className={`w-full group flex items-center gap-3 text-xs font-sans transition-all py-1.5 px-2.5 rounded-xl cursor-pointer ${
                    isSelected
                      ? "bg-sand/20 ring-1 ring-gold shadow-sm"
                      : "hover:bg-sand/10"
                  }`}
                  title={`Filter by ${star} star reviews`}
                >
                  <span className="w-7 text-right font-semibold text-charcoal">
                    {star} ★
                  </span>
                  <div className="flex-1 h-2 bg-sand/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-[11px] text-muted font-sans font-medium">
                    {count} ({percentage}%)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Fit Feedback Bar (3 cols) */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-sand/30 pt-6 lg:pt-0 lg:pl-8 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-sans uppercase tracking-[0.28em] text-muted font-semibold">
                Fit Feedback
              </p>
              <span className="text-[11px] font-sans font-semibold text-charcoal">
                {fitMetrics.true}% True to Size
              </span>
            </div>

            {/* Gradient Fit Indicator Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-sand/30 p-0.5 gap-0.5">
              {fitMetrics.small > 0 && (
                <div
                  className="h-full rounded-l-full bg-terracotta transition-all duration-700"
                  style={{ width: `${fitMetrics.small}%` }}
                  title={`Runs Small: ${fitMetrics.small}%`}
                />
              )}
              {fitMetrics.true > 0 && (
                <div
                  className="h-full bg-gold transition-all duration-700"
                  style={{ width: `${fitMetrics.true}%` }}
                  title={`True to Size: ${fitMetrics.true}%`}
                />
              )}
              {fitMetrics.large > 0 && (
                <div
                  className="h-full rounded-r-full bg-sea-gem transition-all duration-700"
                  style={{ width: `${fitMetrics.large}%` }}
                  title={`Runs Large: ${fitMetrics.large}%`}
                />
              )}
            </div>

            <div className="grid grid-cols-3 text-[10px] font-sans text-muted text-center pt-1">
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-terracotta mb-1" />
                <span>Runs Small</span>
                <span className="font-semibold text-charcoal mt-0.5">
                  {fitMetrics.small}%
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-gold mb-1" />
                <span>True to Size</span>
                <span className="font-semibold text-charcoal mt-0.5">{fitMetrics.true}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-sea-gem mb-1" />
                <span>Runs Large</span>
                <span className="font-semibold text-charcoal mt-0.5">
                  {fitMetrics.large}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FEATURED STORY REVIEW (Editorial Heritage Style) */}
      {isFeaturedBlockVisible && featuredReview && (
        <div className="mb-12 relative rounded-3xl overflow-hidden bg-paper-light text-charcoal p-8 sm:p-10 border border-sand/40 shadow-luxury">
          {/* Ambient glow effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-lotus/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top badge line */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-sand/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lotus" />
              <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
                Featured Community Story
              </span>
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={featuredReview.rating} className="w-4 h-4" />
              <span className="text-xs font-sans text-muted">{formatDate(featuredReview.date)}</span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story text */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-start gap-3">
                <Quote className="w-8 h-8 text-gold/40 flex-shrink-0 -mt-1" />
                <h3 className="font-editorial-italic text-2xl sm:text-3xl font-light leading-snug text-charcoal-rich">
                  &ldquo;{featuredReview.title}&rdquo;
                </h3>
              </div>

              <p className="font-sans text-sm sm:text-base text-charcoal/85 leading-relaxed pl-11 font-light">
                {featuredReview.body}
              </p>

              <div className="pl-11 pt-3 flex flex-wrap items-center gap-4 text-xs font-sans">
                <span className="uppercase tracking-widest text-charcoal font-semibold">
                  {featuredReview.reviewerName}
                </span>
                <span className="text-sand text-xs">•</span>
                <span className="text-muted">{featuredReview.reviewerLocation}</span>
                {featuredReview.verified && (
                  <span className="inline-flex items-center gap-1 text-sage text-[11px] bg-sage/10 px-2.5 py-0.5 rounded-full border border-sage/30 font-medium">
                    <Check className="w-3 h-3 text-sage" /> Verified Buyer
                  </span>
                )}
                <span className="text-sand text-xs">•</span>
                <span className="text-xs text-muted">
                  Fit: {featuredReview.fit === "true" ? "True to Size" : `Runs ${featuredReview.fit}`}
                </span>
              </div>
            </div>

            {/* Photo / Thumbnail if present */}
            {featuredReview.photos && featuredReview.photos.length > 0 && (
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div
                  onClick={() =>
                    setActivePhoto({
                      url: featuredReview.photos![0],
                      reviewTitle: featuredReview.title,
                      reviewer: `${featuredReview.reviewerName} · ${featuredReview.reviewerLocation}`,
                    })
                  }
                  className="group relative cursor-pointer aspect-[3/4] w-48 sm:w-56 rounded-2xl overflow-hidden border border-sand/40 bg-paper-dark shadow-md transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={featuredReview.photos[0]}
                    alt={featuredReview.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-white flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-gold" /> View customer photo
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. FILTER & SORT CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-sand/30">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFilterType("all");
              setStarFilter(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.18em] transition-all border cursor-pointer ${
              filterType === "all" && starFilter === null
                ? "bg-gold text-charcoal font-semibold border-gold shadow-sm"
                : "bg-paper-light border-sand/40 text-charcoal/80 hover:border-gold hover:text-gold"
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setFilterType(filterType === "verified" ? "all" : "verified")}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.18em] transition-all border flex items-center gap-1.5 cursor-pointer ${
              filterType === "verified"
                ? "bg-gold text-charcoal font-semibold border-gold shadow-sm"
                : "bg-paper-light border-sand/40 text-charcoal/80 hover:border-gold hover:text-gold"
            }`}
          >
            <CheckCircle2 className={`w-3 h-3 ${filterType === "verified" ? "text-charcoal" : "text-sage"}`} />
            Verified Only
          </button>

          <button
            onClick={() => setFilterType(filterType === "photos" ? "all" : "photos")}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.18em] transition-all border flex items-center gap-1.5 cursor-pointer ${
              filterType === "photos"
                ? "bg-gold text-charcoal font-semibold border-gold shadow-sm"
                : "bg-paper-light border-sand/40 text-charcoal/80 hover:border-gold hover:text-gold"
            }`}
          >
            <ImageIcon className={`w-3 h-3 ${filterType === "photos" ? "text-charcoal" : "text-sea-gem"}`} />
            With Photos
          </button>

          {starFilter !== null && (
            <button
              onClick={() => setStarFilter(null)}
              className="px-3.5 py-2 rounded-full text-xs font-sans uppercase tracking-[0.15em] bg-gold text-charcoal font-semibold border border-gold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{starFilter} Stars Only</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Sort Selector Dropdown */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <label
            htmlFor="reviews-sort"
            className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted whitespace-nowrap"
          >
            Sort by:
          </label>
          <div className="relative">
            <select
              id="reviews-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-paper-light border border-sand/40 rounded-xl px-3.5 py-2 pr-9 text-xs font-sans text-charcoal focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5. REVIEWS GRID (Light Luxury Cards) */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-paper-light rounded-3xl border border-sand/40 p-8 shadow-sm">
          <Filter className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="font-serif text-xl text-charcoal">
            No reviews match your selected filter
          </p>
          <p className="font-sans text-xs text-muted mt-1">
            Try resetting your filters or selecting a different star category.
          </p>
          <button
            onClick={() => {
              setFilterType("all");
              setStarFilter(null);
            }}
            className="mt-4 px-5 py-2 rounded-full text-xs font-sans uppercase tracking-widest bg-gold text-charcoal font-semibold hover:bg-cinnamon hover:text-white transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleReviews.map((review) => {
            const hasVoted = userVoted[review.id];
            const currentHelpfulCount = review.helpfulCount + (helpfulVotes[review.id] || 0);

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col justify-between bg-paper-light border border-sand/40 hover:border-gold/50 rounded-2xl p-6 shadow-sm transition-all group"
              >
                <div>
                  {/* Top Row: Stars, Fit Badge & Date */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <StarRating rating={review.rating} />
                      <span className="text-[10px] font-sans uppercase tracking-wider text-charcoal/80 bg-sand/20 px-2.5 py-0.5 rounded-md font-medium">
                        Fit:{" "}
                        {review.fit === "true"
                          ? "True to size"
                          : review.fit === "small"
                          ? "Runs small"
                          : "Runs large"}
                      </span>
                    </div>
                    <span className="text-[11px] font-sans text-muted">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <h4 className="font-serif text-lg font-medium text-charcoal mb-2">
                    &ldquo;{review.title}&rdquo;
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-charcoal/85 leading-relaxed font-light mb-4">
                    {review.body}
                  </p>

                  {/* Customer Photos Thumbnails */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.photos.map((photoUrl, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() =>
                            setActivePhoto({
                              url: photoUrl,
                              reviewTitle: review.title,
                              reviewer: review.reviewerName,
                            })
                          }
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-sand/40 hover:border-gold transition-all duration-200 group/img focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer"
                          title="Click to view photo"
                        >
                          <img
                            src={photoUrl}
                            alt={`${review.reviewerName}'s photo ${pIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Reviewer Info & Helpful Vote */}
                <div className="pt-4 border-t border-sand/30 flex items-center justify-between mt-auto">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-sans font-semibold text-charcoal">
                        {review.reviewerName}
                      </span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-sage font-medium">
                          <Check className="w-3 h-3 text-sage stroke-[2.5]" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-sans text-muted">
                      {review.reviewerLocation}
                    </p>
                  </div>

                  {/* Helpful Button */}
                  <button
                    onClick={() => handleVoteHelpful(review.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border cursor-pointer ${
                      hasVoted
                        ? "bg-gold/20 text-charcoal border-gold/50 shadow-sm"
                        : "bg-paper border-sand/40 text-muted hover:bg-sand/15 hover:text-charcoal hover:border-sand/60"
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${
                        hasVoted ? "fill-gold text-gold" : "text-muted"
                      }`}
                    />
                    <span>{currentHelpfulCount}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 6. PAGINATION / LOAD MORE */}
      {visibleCount < filteredReviews.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-8 py-3.5 rounded-full border border-sand/40 bg-paper-light text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all shadow-md cursor-pointer"
          >
            Load More Stories ({filteredReviews.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* 7. CUSTOMER PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhoto(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative z-10 max-w-2xl w-full bg-paper-light text-charcoal rounded-3xl overflow-hidden border border-sand/40 shadow-2xl"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sand/20 text-charcoal hover:bg-sand/40 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[4/5] sm:aspect-[4/3] bg-paper-dark">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.reviewTitle}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-5 sm:p-6 bg-paper border-t border-sand/30">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold mb-1 font-semibold">
                  Customer Experience
                </p>
                <h4 className="font-serif text-lg font-medium text-charcoal">
                  &ldquo;{activePhoto.reviewTitle}&rdquo;
                </h4>
                <p className="text-xs font-sans text-muted mt-1">{activePhoto.reviewer}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}
    </section>
  );
}
