/**
 * BINDY Clothing — Size Guide Data Layer
 * Single source of truth for both the standalone /size-guide page and the PDP SizeGuideModal.
 * 
 * Note on Bust sequence: In the client specification table:
 * AUS/UK 10: 35.0–36.6 in
 * AUS/UK 12: 37.8–38.2 in
 * AUS/UK 14: 35.8–39.8 in
 * (Client flagged for review: non-monotonic jump at size 14 lower bound 35.8).
 * Stored here so it can be adjusted in one line once confirmed.
 */

export interface MeasurementRange {
  cm: string;
  in: string;
}

export interface SizeMeasurement {
  size: number; // AUS / UK
  bust: MeasurementRange;
  waist: MeasurementRange;
  hip: MeasurementRange;
}

export interface SizeConversion {
  ausUk: number;
  usa: number;
  eu: number;
}

export const SIZE_CONVERSIONS: SizeConversion[] = [
  { ausUk: 4, usa: 0, eu: 32 },
  { ausUk: 6, usa: 2, eu: 34 },
  { ausUk: 8, usa: 4, eu: 36 },
  { ausUk: 10, usa: 6, eu: 38 },
  { ausUk: 12, usa: 8, eu: 40 },
  { ausUk: 14, usa: 10, eu: 42 },
];

export const BODY_MEASUREMENTS: SizeMeasurement[] = [
  {
    size: 4,
    bust: { in: "30.9–31.9", cm: "78.5–81.0" },
    waist: { in: "23.4–24.4", cm: "59.4–62.0" },
    hip: { in: "34.1–35.0", cm: "86.6–88.9" },
  },
  {
    size: 6,
    bust: { in: "31.9–33.5", cm: "81.0–85.1" },
    waist: { in: "24.4–26.0", cm: "62.0–66.0" },
    hip: { in: "35.0–36.6", cm: "88.9–93.0" },
  },
  {
    size: 8,
    bust: { in: "33.5–35.0", cm: "85.1–88.9" },
    waist: { in: "26.0–27.6", cm: "66.0–70.1" },
    hip: { in: "36.6–38.2", cm: "93.0–97.0" },
  },
  {
    size: 10,
    bust: { in: "35.0–36.6", cm: "88.9–93.0" },
    waist: { in: "27.6–29.1", cm: "70.1–73.9" },
    hip: { in: "38.2–39.8", cm: "97.0–101.1" },
  },
  {
    size: 12,
    bust: { in: "37.8–38.2", cm: "96.0–97.0" },
    waist: { in: "29.1–30.7", cm: "73.9–78.0" },
    hip: { in: "39.8–40.6", cm: "101.1–103.1" },
  },
  {
    size: 14,
    bust: { in: "35.8–39.8", cm: "90.9–101.1" },
    waist: { in: "30.7–32.9", cm: "78.0–83.6" },
    hip: { in: "40.6–42.9", cm: "103.1–109.0" },
  },
];

export const MEASURING_GUIDE_TIPS = [
  {
    title: "1. Bust",
    desc: "Measure around the fullest part of your chest, keeping the tape level and relaxed under your arms.",
  },
  {
    title: "2. Waist",
    desc: "Measure around your natural waistline, typically the narrowest point of your torso slightly above the navel.",
  },
  {
    title: "3. Hips",
    desc: "Stand with your heels together and measure around the fullest curve of your hips and seat.",
  },
];
