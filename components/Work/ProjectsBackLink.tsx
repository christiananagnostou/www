import Link from 'next/link'
import styled from 'styled-components'

export default function ProjectsBackLink() {
  return <Back href="/projects">/ Projects</Back>
}

const Back = styled(Link)`
  display: inline-flex;
  font-size: 0.85rem;
  color: var(--project-accent);
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: var(--project-accent);
    text-decoration: underline;
    text-underline-offset: 0.25em;
  }
`
