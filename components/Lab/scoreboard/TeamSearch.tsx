import { useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import * as m from 'framer-motion/m'
import styled from 'styled-components'

import type { TeamInfo } from '../../../lib/mlb/types'

interface TeamSearchProps {
  teams: TeamInfo[]
  value: string
  onChange: (value: string) => void
  onSelect: (team: TeamInfo) => void
}

export default function TeamSearch({ teams, value, onChange, onSelect }: TeamSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const filteredTeams = useMemo(() => filterTeams(teams, value), [teams, value])

  const selectTeam = (team: TeamInfo) => {
    onSelect(team)
    setIsOpen(false)
    setHighlightedIndex(-1)
    setError(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
      return
    }

    if (!isOpen || filteredTeams.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((current) => (current + 1) % filteredTeams.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((current) => (current - 1 + filteredTeams.length) % filteredTeams.length)
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault()
      selectTeam(filteredTeams[highlightedIndex])
      inputRef.current?.blur()
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const normalizedValue = value.trim().toLowerCase()
    const team =
      teams.find(
        ({ name, teamCode }) => name.toLowerCase() === normalizedValue || teamCode.toLowerCase() === normalizedValue
      ) ?? filteredTeams[0]

    if (team) {
      selectTeam(team)
    } else {
      setError('Team not found — try a city, team name, or abbreviation.')
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    onChange('')
    setError(null)
    setHighlightedIndex(-1)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" role="search">
      <Label htmlFor="team-search">Search MLB Team</Label>
      <InputRow>
        <AnimatePresence initial={false}>
          {error && (
            <ErrorMessage initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {error}
            </ErrorMessage>
          )}
        </AnimatePresence>
        <InputControl>
          <input
            id="team-search"
            ref={inputRef}
            placeholder="Enter team (e.g. ATH, Giants)"
            value={value}
            onChange={(event) => {
              onChange(event.target.value)
              setError(null)
              setIsOpen(true)
              setHighlightedIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="team-search-list"
            aria-activedescendant={
              highlightedIndex >= 0 ? `team-option-${filteredTeams[highlightedIndex]?.id}` : undefined
            }
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          {value && (
            <ClearButton
              type="button"
              aria-label="Clear team search"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
            >
              ×
            </ClearButton>
          )}
        </InputControl>

        {isOpen && filteredTeams.length > 0 && (
          <Dropdown id="team-search-list" role="listbox" aria-label="Team suggestions">
            {filteredTeams.map((team, index) => (
              <TeamOption
                key={team.id}
                id={`team-option-${team.id}`}
                role="option"
                aria-selected={highlightedIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectTeam(team)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <TeamCode>{highlightMatch(team.teamCode, value)}</TeamCode>
                <TeamName>{highlightMatch(team.name, value)}</TeamName>
              </TeamOption>
            ))}
          </Dropdown>
        )}
      </InputRow>
    </form>
  )
}

function filterTeams(teams: TeamInfo[], value: string) {
  const normalizedValue = value.trim().toLowerCase()
  if (!normalizedValue) return []

  return teams.filter(
    ({ name, teamCode }) =>
      name.toLowerCase().includes(normalizedValue) || teamCode.toLowerCase().includes(normalizedValue)
  )
}

function highlightMatch(text: string, value: string) {
  const matchIndex = text.toLowerCase().indexOf(value.trim().toLowerCase())
  if (matchIndex === -1 || !value.trim()) return text

  return (
    <>
      {text.slice(0, matchIndex)}
      <strong>{text.slice(matchIndex, matchIndex + value.trim().length)}</strong>
      {text.slice(matchIndex + value.trim().length)}
    </>
  )
}

const Label = styled.label`
  display: block;
  margin: 1rem 0 0.5rem;
  color: var(--heading);
  font-size: 1rem;
  font-weight: 500;
`

const InputRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const InputControl = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    flex: 1;
    width: 100%;
    padding: 0.55rem 2.2rem 0.55rem 0.8rem;
    color: inherit;
    font-size: 0.9rem;
    background: var(--dark-bg, #141414);
    border: 1px solid var(--accent);
    border-radius: 0.5rem;

    &:focus {
      border-color: var(--text-dark);
      outline: none;
    }
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 0.4rem;
  top: 50%;
  display: grid;
  width: 1.45rem;
  height: 1.45rem;
  padding: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 50%;
  transform: translateY(-50%);
  place-items: center;
  transition: color 0.15s ease;

  &:hover,
  &:focus-visible {
    color: var(--heading);
  }

  &:focus-visible {
    outline: 2px solid var(--heading);
    outline-offset: 2px;
  }
`

const ErrorMessage = styled(m.p)`
  margin: 0;
  color: #ff4d4f;
`

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 10;
  max-height: 220px;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  list-style: none;
  background: var(--dark-bg, #141414);
  border: 1px solid var(--accent, #303030);
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
`

const TeamOption = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;
  cursor: pointer;
  transition: background 0.15s;

  &[aria-selected='true'],
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const TeamCode = styled.span`
  width: 38px;
`

const TeamName = styled.span`
  flex: 1;
`
