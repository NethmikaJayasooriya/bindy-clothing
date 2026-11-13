/**
 * Client-approved body measurements from the launch size-guide reference.
 * Shared by the size-guide page and the product size-guide modal.
 * Values are body measurements, not finished-garment measurements.
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
  { ausUk: 6, usa: 2, eu: 34 },
  { ausUk: 8, usa: 4, eu: 36 },
  { ausUk: 10, usa: 6, eu: 38 },
  { ausUk: 12, usa: 8, eu: 40 },
  { ausUk: 14, usa: 10, eu: 42 },
];

export const BODY_MEASUREMENTS: SizeMeasurement[] = [
  { size: 6, bust: { in: "31", cm: "79" }, waist: { in: "24.5", cm: "62" }, hip: { in: "34", cm: "86" } },
  { size: 8, bust: { in: "33", cm: "84" }, waist: { in: "26.5", cm: "67" }, hip: { in: "36", cm: "91" } },
  { size: 10, bust: { in: "35", cm: "89" }, waist: { in: "28.5", cm: "72" }, hip: { in: "38", cm: "97" } },
  { size: 12, bust: { in: "37", cm: "94" }, waist: { in: "30.5", cm: "77" }, hip: { in: "40", cm: "102" } },
  { size: 14, bust: { in: "39", cm: "99" }, waist: { in: "32.5", cm: "83" }, hip: { in: "42", cm: "107" } },
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
