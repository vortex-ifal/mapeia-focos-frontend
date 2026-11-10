declare module "leaflet.heat" {
  import * as L from "leaflet";

  export type HeatLayerOptions = {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  };

  export class HeatLayer extends L.Layer {
    constructor(
      latlngs: Array<[number, number, number] | [number, number]>,
      options?: HeatLayerOptions,
    );
    setLatLngs(
      latlngs: Array<[number, number, number] | [number, number]>,
    ): this;
    addLatLng(latlng: [number, number, number] | [number, number]): this;
    setOptions(options: HeatLayerOptions): this;
    redraw(): this;
  }
}
