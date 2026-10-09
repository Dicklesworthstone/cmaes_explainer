/** Preserve the desktop lens while retaining its horizontal coverage in portrait. */
export function robotCameraVerticalFov(
  baseFov: number,
  width: number,
  height: number,
): number {
  // Canvas may briefly have no measured size while mounting or rotating.
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return baseFov;
  }
  if (width >= height) return baseFov;
  const portraitFov =
    (2 *
      Math.atan((Math.tan((baseFov * Math.PI) / 360) * height) / width) *
      180) /
    Math.PI;
  // Avoid an almost-flat projection in an exceptionally narrow split pane.
  return Math.min(100, portraitFov);
}
