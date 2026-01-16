import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import type { AlignedData, Series } from 'uplot'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

interface Props {
  title: string
  labels: number[]
  primarySeries: Array<number | null>
  primaryLabel: string
  primaryColor: string
  secondarySeries?: Array<number | null>
  secondaryLabel?: string
  secondaryColor?: string
  tertiarySeries?: Array<number | null>
  tertiaryLabel?: string
  tertiaryColor?: string
  height?: number
}

const FitnessLaneChart = ({
  title,
  labels,
  primarySeries,
  primaryLabel,
  primaryColor,
  secondarySeries,
  secondaryLabel,
  secondaryColor,
  tertiarySeries,
  tertiaryLabel,
  tertiaryColor,
  height = 120,
}: Props) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<uPlot | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const seriesConfig = useMemo(() => {
    const series: Series[] = [
      {},
      {
        label: primaryLabel,
        stroke: primaryColor,
        width: 2,
        points: { show: false },
        value: (u, v) => (v == null ? '' : `${v.toFixed(1)}`),
      },
    ]

    if (secondarySeries) {
      series.push({
        label: secondaryLabel ?? 'Secondary',
        stroke: secondaryColor ?? '#4fa3ff',
        width: 2,
        dash: [5, 4],
        points: { show: false },
        value: (u, v) => (v == null ? '' : `${v.toFixed(0)}`),
      })
    }

    if (tertiarySeries) {
      series.push({
        label: tertiaryLabel ?? 'Tertiary',
        stroke: tertiaryColor ?? '#f4ff7a',
        width: 2,
        dash: [2, 6],
        points: { show: false },
        value: (u, v) => (v == null ? '' : `${v.toFixed(0)}`),
      })
    }

    return series
  }, [
    primaryColor,
    primaryLabel,
    secondaryColor,
    secondaryLabel,
    secondarySeries,
    tertiaryColor,
    tertiaryLabel,
    tertiarySeries,
  ])

  const data = useMemo<AlignedData>(() => {
    const base: Array<number[] | Array<number | null>> = [labels, primarySeries]
    if (secondarySeries) base.push(secondarySeries)
    if (tertiarySeries) base.push(tertiarySeries)
    return base as AlignedData
  }, [labels, primarySeries, secondarySeries, tertiarySeries])

  useEffect(() => {
    if (!chartRef.current) return

    plotRef.current?.destroy()
    tooltipRef.current?.remove()

    const rootStyles = getComputedStyle(document.documentElement)
    const textDark = rootStyles.getPropertyValue('--text-dark') || '#999'
    const grid = 'rgb(255 255 255 / 8%)'

    tooltipRef.current = document.createElement('div')
    tooltipRef.current.className = 'uplot-tooltip'
    chartRef.current.appendChild(tooltipRef.current)

    plotRef.current = new uPlot(
      {
        width: Math.max(chartRef.current.clientWidth - 12, 240),
        height,
        pxAlign: 0,
        padding: [4, 6, 16, 24],
        scales: { x: { time: false } },
        axes: [
          {
            size: 16,
            stroke: textDark,
            grid: { stroke: grid, width: 1 },
            values: (u, ticks) => ticks.map((t) => `W${t}`),
          },
          {
            size: 22,
            stroke: textDark,
            values: (u, ticks) => ticks.map((t) => t.toFixed(0)),
            grid: { stroke: grid, width: 1 },
          },
        ],
        series: seriesConfig,
        cursor: {
          points: { size: 6, stroke: '#fff', fill: '#000' },
        },
        hooks: {
          setCursor: [
            (u) => {
              if (!tooltipRef.current) return
              const { idx } = u.cursor
              if (idx == null || idx < 0 || idx >= labels.length) {
                tooltipRef.current.style.opacity = '0'
                return
              }
              const left = u.valToPos(labels[idx], 'x', true)
              const top = 6
              const lines: string[] = [`Week ${labels[idx]}`]
              seriesConfig.slice(1).forEach((series, index) => {
                const value = (data[index + 1][idx] as number | null) ?? null
                if (value == null) return
                const formatted = index === 0 ? value.toFixed(1) : value.toFixed(0)
                lines.push(`${series.label}: ${formatted}`)
              })
              tooltipRef.current.innerHTML = lines.join('<br />')
              tooltipRef.current.style.opacity = '1'

              const chartWidth = chartRef.current?.clientWidth || 0
              const tooltipWidth = 120
              const clampedLeft = Math.max(tooltipWidth / 2, Math.min(left, chartWidth - tooltipWidth / 2))
              tooltipRef.current.style.transform = `translate(calc(${clampedLeft}px - 50%), ${top}px)`
            },
          ],
        },
      },
      data,
      chartRef.current
    )

    return () => {
      plotRef.current?.destroy()
      plotRef.current = null
      tooltipRef.current?.remove()
    }
  }, [data, height, labels, seriesConfig])

  return (
    <ChartCard>
      <ChartHeader>
        <h4>{title}</h4>
        <Legend>
          <LegendItem $color={primaryColor}>{primaryLabel}</LegendItem>
          {secondarySeries ? <LegendItem $color={secondaryColor ?? '#4fa3ff'}>{secondaryLabel}</LegendItem> : null}
          {tertiarySeries ? <LegendItem $color={tertiaryColor ?? '#f4ff7a'}>{tertiaryLabel}</LegendItem> : null}
        </Legend>
      </ChartHeader>
      <div ref={chartRef} className="uplot-host" />
    </ChartCard>
  )
}

export default FitnessLaneChart

const ChartCard = styled.div`
  display: grid;
  gap: 0.6rem;
  padding: 0.9rem 1rem 1rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid rgb(255 255 255 / 8%);
  background: rgb(255 255 255 / 3%);
  color: var(--text);

  .uplot-host {
    min-height: 120px;
  }

  .uplot-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 0.3rem 0.45rem;
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: var(--border-radius-lg);
    background: rgb(17 17 17 / 95%);
    font-size: 0.5rem;
    color: var(--text);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    backdrop-filter: blur(8px);
  }
`

const ChartHeader = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  h4 {
    margin: 0;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--heading);
  }
`

const Legend = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.3rem 0.6rem;
  white-space: nowrap;
`

const LegendItem = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  min-width: 44px;
  font-size: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.25px;
  color: var(--text-dark);
  white-space: nowrap;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
  }
`
