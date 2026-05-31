// utils/color.ts

// Parse a hex color into RGB components
function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, '0'))
    .join('');
}

// Replicates: color-mix(in srgb, colorA X%, colorB)
export function colorMix(colorA: string, colorB: string, amountA: number) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const t = amountA / 100;
  return rgbToHex(
    a.r * t + b.r * (1 - t),
    a.g * t + b.g * (1 - t),
    a.b * t + b.b * (1 - t),
  );
}