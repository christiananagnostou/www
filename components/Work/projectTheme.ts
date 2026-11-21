import type { CSSProperties } from 'react'

import type { ProjectType } from '../../lib/projects'

// Keep the original brand color for filled controls; lift the same hue for text on dark surfaces.
export function projectTheme(color: ProjectType['themeColor']) {
  return {
    '--project-color': color,
    '--project-accent': 'color-mix(in srgb, var(--project-color) 68%, #ffffff)',
  } as CSSProperties
}
