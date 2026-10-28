// Width descriptors describe the entire photograph, including the part cropped
// outside the screen. 100vw under-resolves a landscape photo covering a tall hero.
export function heroImageSizes(ratio: number, opening = false): string {
  const mobileHeight = opening ? .7 : 1;
  const round = (value: number) => Number(value.toFixed(2));
  const mobile = `${round(ratio * mobileHeight * 100)}dvh`;
  return `(max-width: 700px) and (max-height: 680px) max(100vw, ${mobile}, ${round(ratio * mobileHeight * 520)}px), (max-width: 700px) max(100vw, ${mobile}, ${round(ratio * mobileHeight * 580)}px), max(100vw, min(${round(ratio * 100)}svh, ${round(ratio * 1200)}px), ${round(ratio * 720)}px)`;
}
