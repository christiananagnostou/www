export type StravaActivity = {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
  type: 'Swim' | 'Ride' | 'Run' | 'WeightTraining' | 'Hike' | 'Zwift'
  Distance?: string
  ElevationGain?: string
  MovingTime?: string
  AverageSpeed?: string
  Pace?: string
  MaxSpeed: string | null
  MapPolyline: string | null
  best: {
    Distance: number
    ElevationGain: number
    MovingTime: number
    AverageSpeed: number
    Pace: number
  }
}
