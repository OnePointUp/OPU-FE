export function calcIntensity(
  total: number,
  completed: number
): number {
  if (total === 0) return 0;

  const ratio = completed / total;

  if (ratio === 0) return 0;
  if (ratio < 0.2) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.6) return 3;
  if (ratio < 0.8) return 4;

  return 5;
}
