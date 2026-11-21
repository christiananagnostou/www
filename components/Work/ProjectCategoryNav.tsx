import Link from 'next/link'

import { projectCategories, type ProjectCategory } from '../../lib/projects/categories'
import styles from './ProjectsIndex.module.css'

const categories = {
  all: { label: 'All', path: 'M3 3h5v5H3z M12 3h5v5h-5z M3 12h5v5H3z M12 12h5v5h-5z' },
  personal: { label: 'Personal', path: 'M13 6a3 3 0 1 1-6 0 3 3 0 1 1 6 0z M3.5 17a6.5 6.5 0 0 1 13 0' },
  commercial: { label: 'Commercial', path: 'M2 6h16v11H2z M7 6V3h6v3 M2 10q8 4 16 0 M10 10v3' },
  'open-source': { label: 'Open source', path: 'm6 6-4 4 4 4m8-8 4 4-4 4m-3-11-2 14' },
}

export default function ProjectCategoryNav({ selected }: { selected?: ProjectCategory }) {
  return (
    <nav className={styles.categories} aria-label="Project categories">
      {(['all', ...projectCategories] as const).map((category) => (
        <Link
          key={category}
          href={category === 'all' ? '/projects' : { pathname: '/projects', query: { tag: category } }}
          aria-current={(selected ?? 'all') === category ? 'page' : undefined}
          shallow
          scroll={false}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={categories[category].path} />
          </svg>
          {categories[category].label}
        </Link>
      ))}
    </nav>
  )
}
