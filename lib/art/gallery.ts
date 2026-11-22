import { SortedArtImages } from './index'

export const photoFilters = [
  null,
  ...Array.from(new Set(SortedArtImages.flatMap((photo) => photo.tags))).toSorted((a, b) => a.localeCompare(b)),
]

export const photosForTag = (tag: string | null) =>
  tag ? SortedArtImages.filter((photo) => photo.tags.includes(tag)) : SortedArtImages
