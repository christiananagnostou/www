export type FitnessActivityType = 'Swim' | 'Ride' | 'Run' | 'WeightTraining' | 'Hike' | 'Zwift' | 'Walk' | 'Other'

export interface StoredFitnessActivity {
  title: string
  pubDate: string
  guid: string
  type: FitnessActivityType
  Distance?: string
  ElevationGain?: string
  MovingTime?: string
  AverageSpeed?: string
  Pace?: string
  AverageHeartRate?: number | null
  AverageWatts?: number | null
}

export interface FitnessActivity extends StoredFitnessActivity {
  best: {
    MovingTime: number
    Distance: number
    Pace: number
    AverageSpeed: number
    ElevationGain: number
  }
}
