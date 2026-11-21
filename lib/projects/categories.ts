export const projectCategories = ['personal', 'commercial', 'open-source'] as const
export type ProjectCategory = (typeof projectCategories)[number]

export function getProjectCategory(tag: string | string[] | undefined) {
  return projectCategories.find((category) => category === tag)
}
