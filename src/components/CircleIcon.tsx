import { DivIcon } from "leaflet";

export const CircleIcon = (color: string): DivIcon => {
  return new DivIcon({
    html: `
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="10" cy="10" r="8" fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
      </svg>
    `,
    className: "train-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};
