import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import type { AlignedData, Series } from 'uplot'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

interface Props {
  title: string
  labels: number[]
  labelTexts?: string[]
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
  labelTexts,
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
    const text = rootStyles.getPropertyValue('--text') || '#eee'
    const textDark = rootStyles.getPropertyValue('--text-dark') || '#999'
    const grid = 'rgb(255 255 255 / 8%)'

    tooltipRef.current = document.createElement('div')
    tooltipRef.current.className = 'uplot-tooltip'
    chartRef.current.appendChild(tooltipRef.current)

    const options = {
      width: Math.max(chartRef.current.clientWidth - 12, 240),
      height,
      pxAlign: 0,
      padding: [4, 6, 16, 24],
      scales: { x: { time: false } },
      legend: { show: false },
      axes: [
        {
          size: 16,
          stroke: textDark,
          grid: { stroke: grid, width: 1 },
          values: (u: uPlot, ticks: number[]) =>
            ticks.map((t) => {
              const index = Math.round(t)
              if (labelTexts?.[index]) return labelTexts[index]
              return `W${index + 1}`
            }),
        },

        {
          size: 22,
          stroke: textDark,
          values: (u: uPlot, ticks: number[]) => ticks.map((t) => t.toFixed(0)),
          grid: { stroke: grid, width: 1 },
        },
      ],
      series: seriesConfig,
      cursor: {
        points: { size: 6, stroke: text, fill: text },
      },
      hooks: {
        setCursor: [
          (u: uPlot) => {
            if (!tooltipRef.current) return
            const { idx } = u.cursor
            if (idx == null || idx < 0 || idx >= labels.length) {
              tooltipRef.current.style.opacity = '0'
              return
            }
            const left = u.valToPos(labels[idx], 'x', true)
            const label = labelTexts?.[idx] ?? `W${labels[idx] + 1}`
            const lines: string[] = [label]
            const valuesAtIndex = seriesConfig
              .slice(1)
              .map((series, index) => ({
                label: series.label,
                value: (data[index + 1][idx] as number | null) ?? null,
                format: index === 0 ? 'float' : 'int',
              }))
              .filter((entry) => entry.value != null)

            valuesAtIndex.forEach((entry) => {
              const value = entry.value as number
              const formatted = entry.format === 'float' ? value.toFixed(1) : value.toFixed(0)
              lines.push(`${entry.label}: ${formatted}`)
            })

            tooltipRef.current.innerHTML = lines.join('<br />')
            tooltipRef.current.style.opacity = '1'

            const primaryValue = valuesAtIndex[0]?.value ?? 0
            const rawTop = u.valToPos(primaryValue, 'y', true) - 24
            const cursorTop = (u as any).cursor?.top ?? rawTop

            const chartHeight = chartRef.current?.clientHeight || 0
            const clampedTop = Math.max(4, Math.min(cursorTop - 24, chartHeight - 36))

            const chartWidth = chartRef.current?.clientWidth || 0
            const tooltipWidth = 120
            const cursorLeft = (u as any).cursor?.left ?? left
            const clampedLeft = Math.max(tooltipWidth / 2, Math.min(cursorLeft, chartWidth - tooltipWidth / 2))
            tooltipRef.current.style.transform = `translate(calc(${clampedLeft}px - 50%), ${clampedTop}px)`
          },
        ],
      },
    } as any

    plotRef.current = new uPlot(options, data, chartRef.current)

    return () => {
      plotRef.current?.destroy()
      plotRef.current = null
      tooltipRef.current?.remove()
    }
  }, [data, height, labelTexts, labels, seriesConfig])

  return (
    <ChartCard>
      <ChartHeader>
        <h4>{title}</h4>
        <ChartLegend>
          <ChartLabel $color={primaryColor}>{primaryLabel}</ChartLabel>
          {secondarySeries ? (
            <ChartLabel $color={secondaryColor ?? '#4fa3ff'}>{secondaryLabel ?? 'Series 2'}</ChartLabel>
          ) : null}
          {tertiarySeries ? (
            <ChartLabel $color={tertiaryColor ?? '#f4ff7a'}>{tertiaryLabel ?? 'Series 3'}</ChartLabel>
          ) : null}
        </ChartLegend>
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
    position: relative;
    min-height: 120px;
  }

  .u-axis .u-val {
    font-size: 0.45rem;
    fill: var(--text-dark);
  }

  .u-axis .u-label {
    font-size: 0.5rem;
    fill: var(--text-dark);
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

const ChartLegend = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`

const ChartLabel = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-dark);
  white-space: nowrap;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
  }
`
