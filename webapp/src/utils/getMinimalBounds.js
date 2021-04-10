export function getMinimalBounds(points) {
  /* Inverted for purpose of finding min rect. */
  let minLat = 90;

  let maxLat = -90;

  let minLng = 180;

  let maxLng = -180;

  points.forEach(([lat, lng]) => {
    if (lat < minLat) {
      minLat = lat;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
  });

  return [
    [minLat, minLng],
    [maxLat, maxLng]
  ];
}
