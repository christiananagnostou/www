import { StaticImageData } from 'next/image'

export interface Project {
  title: string
  desktopImgs: StaticImageData[]
  mobileImgs: StaticImageData[]
  externalLink?: string
  github?: string
  slug: string
  summary: string
  details: { title: string; description: string }[]
}
