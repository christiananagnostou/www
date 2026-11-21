import type { CSSProperties } from 'react'

import type { ProjectType } from '../../lib/projects'

// Keep brand fills intact. A common silver softens the ink across the dark portfolio.
export function projectTheme(color: ProjectType['themeColor']) {
  return {
    '--project-color': color,
    '--project-accent': 'color-mix(in srgb, var(--project-color) 52%, #c4c5c8)',
  } as CSSProperties
}
