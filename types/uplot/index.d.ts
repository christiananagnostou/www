declare module 'uplot' {
  export type AlignedData = Array<Array<number | null>>

  export type Series = {
    label?: string
    scale?: string
    stroke?: string
    width?: number
    fill?: string
    show?: boolean
    dash?: number[]
    value?: (u: UPlot, v: number | null) => string
    points?: { show?: boolean }
    paths?: (u: UPlot, sidx: number, idx0: number, idx1: number) => { fill: Path2D; stroke: Path2D }
  }

  export type Axis = {
    size?: number
    scale?: string
    side?: number
    stroke?: string
    grid?: { stroke?: string; width?: number; show?: boolean }
    values?: (u: UPlot, ticks: number[]) => string[]
  }

  export type Hooks = {
    setCursor?: Array<(u: UPlot) => void>
  }

  export type Options = {
    width: number
    height: number
    pxAlign?: number
    padding?: [number, number, number, number]
    scales?: Record<string, unknown>
    axes?: Axis[]
    series?: Series[]
    cursor?: { points?: { size?: number; stroke?: string; fill?: string } }
    hooks?: Hooks
  }

  export default class UPlot {
    constructor(options: Options, data: AlignedData, target: HTMLElement)
    setSeries(index: number, opts: Partial<Series>): void
    valToPos(value: number, scale: string, canClamp?: boolean): number
    destroy(): void
    cursor: { idx?: number | null }
  }
}
