import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import type { AlignedData } from 'uplot'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

interface Props {
  title: string
  labels: string[]
  values: number[]
  colors?: string[]
  height?: number
}

const colorFromString = (str: string) => {
  let h = 0
  for (let i = 0; i < str.length; i += 1) h = Math.imul(31, h) + str.charCodeAt(i)
  const hue = Math.abs(h) % 360
  return `hsl(${hue}deg 70% 55%)`
}

const FitnessZoneChart = ({ title, labels, values, colors, height = 140 }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<uPlot | null>(null)

  const palette = useMemo(() => {
    if (colors?.length) return colors
    return labels.map((label) => colorFromString(label))
  }, [colors, labels])

  const data = useMemo<AlignedData>(() => {
    const idxs = values.map((_, i) => i)
    return [idxs, values]
  }, [values])

  useEffect(() => {
    if (!chartRef.current) return

    plotRef.current?.destroy()

    const rootStyles = getComputedStyle(document.documentElement)
    const textDark = rootStyles.getPropertyValue('--text-dark') || '#999'
    const grid = 'rgb(255 255 255 / 8%)'

    const options = {
      width: Math.max(chartRef.current.clientWidth - 12, 240),
      height,
      pxAlign: 0,
      padding: [6, 6, 24, 32],
      scales: {
        x: {
          time: false,
          range: () => [-0.5, values.length - 0.5],
        },
      },
      legend: { show: false },

      axes: [
        {
          size: 32,
          stroke: textDark,
          grid: { stroke: grid, width: 1 },
          values: (u: uPlot, ticks: number[]) =>
            ticks.map((tick) => {
              const index = Math.round(tick)
              return labels[index] ?? ''
            }),
        },
        {
          size: 22,
          stroke: textDark,
          values: (u: uPlot, ticks: number[]) => ticks.map((t) => t.toFixed(1)),
          grid: { stroke: grid, width: 1 },
        },
      ],
      series: [
        {},
        {
          label: title,
          stroke: 'transparent',
          fill: 'transparent',
          paths: () => null,
          points: { show: false },
        },
      ],
      hooks: {
        draw: [
          (u: uPlot) => {
            const ctx = (u as any).ctx as CanvasRenderingContext2D | undefined
            if (!ctx) return
            const y0 = u.valToPos(0, 'y', true)
            const xStep = u.valToPos(1, 'x', true) - u.valToPos(0, 'x', true)
            const barWidth = Math.max(xStep * 0.6, 10)

            values.forEach((value, index) => {
              const x = u.valToPos(index, 'x', true)
              const y = u.valToPos(value, 'y', true)
              ctx.fillStyle = palette[index] ?? '#888'
              ctx.globalAlpha = 0.75
              ctx.fillRect(x - barWidth / 2, y, barWidth, y0 - y)
              ctx.globalAlpha = 1
            })
          },
        ],
      },
    } as any

    plotRef.current = new uPlot(options, data, chartRef.current)

    return () => {
      plotRef.current?.destroy()
      plotRef.current = null
    }
  }, [data, height, labels, palette, title, values])

  return (
    <ChartCard>
      <ChartHeader>
        <h4>{title}</h4>
      </ChartHeader>
      <div ref={chartRef} className="uplot-host" />
    </ChartCard>
  )
}

export default FitnessZoneChart

const ChartCard = styled.div`
  display: grid;
  gap: 0.6rem;
  padding: 0.9rem 1rem 1rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid rgb(255 255 255 / 8%);
  background: rgb(255 255 255 / 3%);
  color: var(--text);

  .uplot-host {
    min-height: 140px;
  }

  .u-axis .u-val {
    font-size: 0.5rem;
    fill: var(--text-dark);
  }
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  h4 {
    margin: 0;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    color: var(--heading);
  }
`
