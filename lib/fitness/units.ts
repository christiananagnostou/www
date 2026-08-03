export const METERS_PER_KILOMETER = 1000
export const METERS_PER_MILE = 1609.344
export const METERS_PER_YARD = 0.9144
export const METERS_PER_FOOT = 0.3048

export const metersToMiles = (meters: number) => meters / METERS_PER_MILE

export const metersToFeet = (meters: number) => meters / METERS_PER_FOOT
