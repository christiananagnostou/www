import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import type { AlignedData, Series } from 'uplot'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

interface WeeklyData {
  labels: number[] // week numbers
  miles: number[]
  hours: number[]
}
interface DistributionData {
  labels: string[]
  counts: number[]
}
interface Props {
  weekly: WeeklyData
  distribution: DistributionData
}

// Generate a consistent color from a string
const colorFromString = (str: string) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i)
  const hue = Math.abs(h) % 360
  return `hsl(${hue}deg 70% 55%)`
}

const rollingAvg = (data: number[], window = 4) => {
  const out: Array<number | null> = []
  for (let i = 0; i < data.length; i++) {
    if (i + 1 < window) {
      out.push(null)
      continue
    }
    let sum = 0
    for (let j = i - window + 1; j <= i; j++) sum += data[j]
    out.push(sum / window)
  }
  return out
}

const FitnessCharts: React.FC<Props> = ({ weekly, distribution }) => {
  const weeklyRef = useRef<HTMLDivElement>(null)
  const distRef = useRef<HTMLDivElement>(null)
  const weeklyPlotRef = useRef<uPlot | null>(null)
  const distPlotRef = useRef<uPlot | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const distTooltipRef = useRef<HTMLDivElement | null>(null)

  const [mode, setMode] = useState<'miles' | 'hours'>('miles')

  // Pre-compute rolling avg for miles
  const milesMA = useMemo(() => rollingAvg(weekly.miles, 4), [weekly.miles])

  // Distribution colors
  const distColors = useMemo(() => distribution.labels.map((l) => colorFromString(l)), [distribution])

  useEffect(() => {
    if (!weeklyRef.current) return

    // Destroy existing on re-init (structure changes only when weekly arrays length changes)
    weeklyPlotRef.current?.destroy()

    const rootStyles = getComputedStyle(document.documentElement)
    const accent = rootStyles.getPropertyValue('--accent') || '#6cf'
    const text = rootStyles.getPropertyValue('--text') || '#eee'
    const textDark = rootStyles.getPropertyValue('--text-dark') || '#999'
    const grid = '#2c2c2c'

    // Data shape for uPlot: [x, y1, y2, y3]
    const xVals = weekly.labels
    const data: AlignedData = [xVals, weekly.miles, weekly.hours, milesMA]

    tooltipRef.current = document.createElement('div')
    tooltipRef.current.className = 'uplot-tooltip'
    weeklyRef.current.appendChild(tooltipRef.current)

    weeklyPlotRef.current = new uPlot(
      {
        width: Math.max(weeklyRef.current.clientWidth - 20, 300), // Account for padding and ensure minimum width
        height: 220,
        pxAlign: 0,
        scales: { x: { time: false }, miles: {}, hours: {}, ma: {} },
        axes: [
          {
            stroke: textDark,
            grid: { stroke: grid, width: 1 },
            values: (u, ticks) => ticks.map((t) => `W${t}`),
          },
          {
            scale: 'miles',
            stroke: textDark,
            values: (u, ticks) => ticks.map((t) => t.toFixed(0)),
            grid: { stroke: grid, width: 1 },
          },
          {
            scale: 'hours',
            side: 1,
            stroke: textDark,
            values: (u, ticks) => ticks.map((t) => t.toFixed(1)),
            grid: { show: false },
          },
        ],
        series: [
          {},
          {
            label: 'Miles',
            scale: 'miles',
            stroke: accent,
            width: 2,
            fill: `${accent.trim()}20`,
            show: mode === 'miles',
            value: (u, v) => (v == null ? '' : `${v.toFixed(1)} mi`),
            points: { show: false }, // Remove markers
          } as Series,
          {
            label: 'Hours',
            scale: 'hours',
            stroke: '#4fa3ff',
            width: 2,
            dash: [4, 4],
            show: mode === 'hours',
            value: (u, v) => (v == null ? '' : `${v.toFixed(1)} h`),
            points: { show: false }, // Remove markers
          } as Series,
          {
            label: 'Miles 4w Avg',
            scale: 'miles',
            stroke: 'orange',
            width: 2,
            dash: [6, 4],
            show: mode === 'miles',
            value: (u, v) => (v == null ? '' : `${v.toFixed(1)} mi`),
            points: { show: false }, // Remove markers
          } as Series,
        ],
        cursor: {
          points: { size: 6, stroke: text, fill: '#000' },
        },
        hooks: {
          setCursor: [
            (u) => {
              if (!tooltipRef.current) return
              const { idx } = u.cursor
              if (idx == null || idx < 0 || idx >= xVals.length) {
                tooltipRef.current.style.opacity = '0'
                return
              }
              const left = u.valToPos(xVals[idx], 'x', true)
              const top = 8
              const milesVal = weekly.miles[idx]
              const hoursVal = weekly.hours[idx]
              const maVal = milesMA[idx]
              tooltipRef.current.innerHTML = `Week ${xVals[idx]}<br/>${milesVal.toFixed(1)} mi · ${hoursVal.toFixed(
                1
              )} h${maVal ? `<br/><span style="color:orange">4w avg: ${maVal.toFixed(1)} mi</span>` : ''}`
              tooltipRef.current.style.opacity = '1'

              // Keep tooltip within chart bounds
              const chartWidth = weeklyRef.current?.clientWidth || 0
              const tooltipWidth = 120 // approximate tooltip width
              const clampedLeft = Math.max(tooltipWidth / 2, Math.min(left, chartWidth - tooltipWidth / 2))
              tooltipRef.current.style.transform = `translate(calc(${clampedLeft}px - 50%), ${top}px)`
            },
          ],
        },
      },
      data,
      weeklyRef.current
    )
  }, [weekly, milesMA, mode])

  // Update series visibility on mode change without full re-init
  useEffect(() => {
    const wp = weeklyPlotRef.current
    if (!wp) return
    // Miles series index 1, hours series index 2, MA index 3
    wp.setSeries(1, { show: mode === 'miles' })
    wp.setSeries(2, { show: mode === 'hours' })
    wp.setSeries(3, { show: mode === 'miles' })
  }, [mode])

  // Distribution chart
  useEffect(() => {
    if (!distRef.current) return
    distPlotRef.current?.destroy()

    const rootStyles = getComputedStyle(document.documentElement)
    const textDark = rootStyles.getPropertyValue('--text-dark') || '#999'
    const grid = '#2c2c2c'

    const idxs = distribution.counts.map((_, i) => i)
    const data: AlignedData = [idxs, distribution.counts]

    distTooltipRef.current = document.createElement('div')
    distTooltipRef.current.className = 'uplot-tooltip'
    distRef.current.appendChild(distTooltipRef.current)

    distPlotRef.current = new uPlot(
      {
        width: Math.max(distRef.current.clientWidth - 20, 300), // Account for padding and ensure minimum width
        height: 260,
        pxAlign: 0,
        scales: { x: { time: false }, y: {} },
        axes: [
          {
            stroke: textDark,
            grid: { stroke: grid, width: 1 },
            values: (u, ticks) => ticks.map((t) => distribution.labels[t] || ''),
          },
          {
            stroke: textDark,
            values: (u, ticks) => ticks.map((t) => t.toFixed(0)),
            grid: { stroke: grid, width: 1 },
          },
        ],
        series: [
          {},
          {
            label: 'Count',
            paths: (u, sidx, idx0, idx1) => {
              const path = new Path2D()
              for (let i = idx0; i < idx1; i++) {
                const x = u.valToPos(i, 'x', true)
                const y = u.valToPos(distribution.counts[i], 'y', true)
                const y0 = u.valToPos(0, 'y', true)
                const bw = (u.valToPos(i + 0.5, 'x', true) - u.valToPos(i - 0.5, 'x', true)) * 0.6
                path.rect(x - bw / 2, y, bw, y0 - y)
              }
              return { fill: path, stroke: path }
            },
            fill: 'rgba(255,255,255,0.05)',
            stroke: 'transparent',
            points: { show: false },
          },
        ],
        hooks: {
          setCursor: [
            (u) => {
              if (!distTooltipRef.current) return
              const { idx } = u.cursor
              if (idx == null || idx < 0 || idx >= distribution.labels.length) {
                distTooltipRef.current.style.opacity = '0'
                return
              }
              const left = u.valToPos(idxs[idx], 'x', true)
              const top = 8
              const label = distribution.labels[idx]
              const count = distribution.counts[idx]
              const color = distColors[idx]
              distTooltipRef.current.innerHTML = `<span style="color:${color}">${label}</span><br/>${count} activities`
              distTooltipRef.current.style.opacity = '1'

              // Keep tooltip within chart bounds
              const chartWidth = distRef.current?.clientWidth || 0
              const tooltipWidth = 120 // approximate tooltip width
              const clampedLeft = Math.max(tooltipWidth / 2, Math.min(left, chartWidth - tooltipWidth / 2))
              distTooltipRef.current.style.transform = `translate(calc(${clampedLeft}px - 50%), ${top}px)`
            },
          ],
        },
      },
      data,
      distRef.current
    )
  }, [distribution, distColors])

  // Apply colored overlays to bars post-render (canvas overlay approach)
  useEffect(() => {
    const canvas = distRef.current?.querySelector('canvas') as HTMLCanvasElement | undefined
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const plot = distPlotRef.current
    if (!plot) return
    // Draw color stripes (light overlay) on top of generic bars
    distribution.counts.forEach((_, i) => {
      const x = plot.valToPos(i, 'x', true)
      const y = plot.valToPos(distribution.counts[i], 'y', true)
      const y0 = plot.valToPos(0, 'y', true)
      const bw = (plot.valToPos(i + 0.5, 'x', true) - plot.valToPos(i - 0.5, 'x', true)) * 0.6
      ctx.fillStyle = distColors[i]
      ctx.globalAlpha = 0.45
      ctx.fillRect(x - bw / 2, y, bw, y0 - y)
      ctx.globalAlpha = 1
    })
  }, [distribution, distColors])

  return (
    <ChartsWrapper>
      <ChartCard>
        <ChartHeader>
          <h3>Weekly {mode === 'miles' ? 'Miles' : 'Hours'}</h3>
          <div className="mode-toggle">
            <button className={mode === 'miles' ? 'active' : ''} onClick={() => setMode('miles')}>
              Miles
            </button>
            <button className={mode === 'hours' ? 'active' : ''} onClick={() => setMode('hours')}>
              Hours
            </button>
          </div>
        </ChartHeader>
        <div ref={weeklyRef} className="uplot-host" />
      </ChartCard>
      <ChartCard>
        <ChartHeader>
          <h3>Activity Distribution</h3>
        </ChartHeader>
        <div ref={distRef} className="uplot-host" />
      </ChartCard>
    </ChartsWrapper>
  )
}
export default FitnessCharts

const ChartsWrapper = styled.section`
  display: contents;
`

const ChartCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 320px;
  padding: 1.5rem clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: var(--border-radius-md);
  background: linear-gradient(135deg, #1e1e1e 0%, #191919 100%);
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    background:
      radial-gradient(circle at 70% 15%, rgb(255 255 255 / 4%), transparent 50%),
      linear-gradient(145deg, rgb(255 255 255 / 3%), transparent 60%);
    pointer-events: none;
    inset: 0;
    mix-blend-mode: overlay;
  }

  &::after {
    content: '';
    position: absolute;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgb(255 255 255 / 10%), transparent 65%);
    opacity: 0;
    transition: opacity 0.3s ease;
    inset: 0;
    mask:
      linear-gradient(#000000, #000000) content-box,
      linear-gradient(#000000, #000000);
    mask-composite: exclude;
  }

  &:hover {
    border-color: rgb(255 255 255 / 15%);
    box-shadow: 0 16px 40px -12px rgb(0 0 0 / 40%);

    &::after {
      opacity: 0.8;
    }
  }

  .uplot-host {
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .uplot {
    font-family: inherit;
  }
  .uplot .u-title {
    display: none;
  }
  .uplot .u-legend {
    display: none;
  }
  .uplot-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 0.45rem 0.65rem;
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: var(--border-radius-lg);
    background: rgb(17 17 17 / 95%);
    box-shadow: 0 8px 32px -8px rgb(0 0 0 / 60%);
    opacity: 0;
    font-size: 0.65rem;
    color: var(--text);
    white-space: nowrap;
    pointer-events: none;
    transition: opacity 0.15s ease;
    backdrop-filter: blur(8px);
  }
`

const ChartHeader = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;

  h3 {
    margin: 0;
    background: linear-gradient(90deg, var(--heading), #c0c0c0 70%);
    background-clip: text;
    font-weight: 600;
    font-size: 0.9rem;
    color: transparent;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mode-toggle {
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    border: 1px solid rgb(255 255 255 / 6%);
    border-radius: var(--border-radius-lg);
    background: rgb(255 255 255 / 4%);
  }

  .mode-toggle button {
    position: relative;
    padding: 0.4rem 0.7rem;
    border: none;
    border-radius: var(--border-radius-lg);
    background: transparent;
    font-weight: 500;
    font-size: 0.65rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.25s ease;

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      background: linear-gradient(135deg, var(--accent), #404040);
      opacity: 0;
      transition: opacity 0.25s ease;
      inset: 0;
    }

    &:hover {
      color: var(--heading);
    }

    &.active {
      font-weight: 600;
      color: var(--heading);

      &::before {
        opacity: 1;
      }
    }
  }
`
