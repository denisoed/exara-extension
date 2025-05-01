/**
 * Interface representing coordinates in either pixels or percentages
 */
export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Converts pixel coordinates to percentage values relative to viewport dimensions
 * @param coordinates Pixel coordinates {x, y}
 * @returns Percentage coordinates {x, y} (0-100)
 */
export function pixelsToPercentage(coordinates: Coordinates): Coordinates {
  return {
    x: (coordinates.x / window.innerWidth) * 100,
    y: (coordinates.y / window.innerHeight) * 100,
  };
}

/**
 * Converts percentage coordinates to pixel values relative to viewport dimensions
 * @param coordinates Percentage coordinates {x, y} (0-100)
 * @returns Pixel coordinates {x, y}
 */
export function percentageToPixels(coordinates: Coordinates): Coordinates {
  return {
    x: (coordinates.x * window.innerWidth) / 100,
    y: (coordinates.y * window.innerHeight) / 100,
  };
}
