export const ARAPIRACA_CENTER: [number, number] = [-9.7515, -36.66];
export const ARAPIRACA_ZOOM = 13;

export function formatHeatmapTotal(total: number): string {
  if (total === 1) {
    return "1 foco mapeado";
  }

  return `${total} focos mapeados`;
}
