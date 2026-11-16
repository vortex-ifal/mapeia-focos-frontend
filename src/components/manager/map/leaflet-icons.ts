import L from "leaflet";

export function createOccurrenceDivIcon(selected: boolean): L.DivIcon {
  if (selected) {
    return L.divIcon({
      className: "",
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:9999px;border:2px solid #C94F32;background-color:rgba(201,79,50,0.15);box-sizing:border-box;">
          <div style="width:18px;height:18px;border-radius:9999px;background-color:#C94F32;border:4px solid #FFFFFF;box-shadow:0 1px 3px rgba(0,0,0,0.25);box-sizing:border-box;"></div>
        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
      tooltipAnchor: [0, -28],
    });
  }

  return L.divIcon({
    className: "",
    html: `
      <div style="width:18px;height:18px;border-radius:9999px;background-color:#584A57;border:4px solid #FFFFFF;box-shadow:0 1px 3px rgba(0,0,0,0.25);box-sizing:border-box;"></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    tooltipAnchor: [0, -11],
  });
}

export function createClusterDivIcon(count: number): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:9999px;border:4px solid #FFFFFF;background-color:#C94F32;color:#FFFFFF;font-size:13px;font-weight:700;box-shadow:0 2px 4px rgba(0,0,0,0.25);box-sizing:border-box;">
        ${count}
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    tooltipAnchor: [0, -26],
  });
}
