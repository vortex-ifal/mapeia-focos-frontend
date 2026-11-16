export type HeatMapPoint = {
  latitude: number;
  longitude: number;
};

export type HeatMapResponse = {
  total: number;
  points: HeatMapPoint[];
};
