import { useState, useRef, useMemo, useEffect } from 'react'
import { TeamInfo } from './types'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

const highlightMatch = (text: string, input: string) => {
  if (!input) return text
  const idx = text.toLowerCase().indexOf(input.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong>{text.slice(idx, idx + input.length)}</strong>
      {text.slice(idx + input.length)}
    </>
  )
}

interface TeamSearchProps {
  teams: TeamInfo[]
  value: string
  onChange: (v: string) => void
  onSelect: (team: TeamInfo) => void
}

const TeamSearch: React.FC<TeamSearchProps> = ({ teams, value, onChange, onSelect }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const filteredTeams = useMemo(() => {
    if (!value.trim()) return []
    const input = value.toLowerCase()
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(input) || t.teamCode.toLowerCase().includes(input) || String(t.id).includes(input)
    )
  }, [value, teams])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlighted >= 0 && itemRefs.current[highlighted] && showDropdown) {
      itemRefs.current[highlighted]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [highlighted, showDropdown])

  // Handle keyboard navigation and selection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && filteredTeams.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlighted((prev) => (prev + 1) % filteredTeams.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlighted((prev) => (prev - 1 + filteredTeams.length) % filteredTeams.length)
      } else if (e.key === 'Enter') {
        if (highlighted >= 0) {
          e.preventDefault()
          onSelect(filteredTeams[highlighted])
          setShowDropdown(false)
          setHighlighted(-1)
          setError(null)
          inputRef.current?.blur()
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false)
        setHighlighted(-1)
      }
    }
    // Allow Enter to submit if dropdown is not open or nothing highlighted
    if (e.key === 'Enter' && (!showDropdown || highlighted === -1)) {
      // Let form handle submit
    }
  }

  // Handle form submit (when Enter is pressed and not selecting from dropdown)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teams.length) return
    const input = value.trim().toLowerCase()
    const resolved =
      teams.find(
        (t) => t.name.toLowerCase() === input || t.teamCode.toLowerCase() === input || String(t.id) === input
      ) || filteredTeams[0]
    if (resolved) {
      onSelect(resolved)
      setShowDropdown(false)
      setHighlighted(-1)
      setError(null)
    } else {
      setError('Team not found — try city, team name, or team code (e.g. ATH, Giants, 147)')
      setShowDropdown(false)
      setHighlighted(-1)
    }
  }

  // Clear error when value changes
  useEffect(() => {
    setError(null)
  }, [value])

  return (
    <form onSubmit={handleSubmit} autoComplete="off" role="search">
      <Label htmlFor="team-search">Search MLB Team</Label>

      <InputRow style={{ position: 'relative' }}>
        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ color: '#ff4d4f', overflow: 'hidden', margin: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <input
          id="team-search"
          ref={inputRef}
          placeholder="Enter team (e.g. ATH, Giants, 147)"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setShowDropdown(true)
            setHighlighted(-1)
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-controls="team-search-list"
          aria-activedescendant={highlighted >= 0 ? `team-option-${filteredTeams[highlighted]?.id}` : undefined}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
        />

        {showDropdown && filteredTeams.length > 0 && (
          <Dropdown id="team-search-list" role="listbox" aria-label="Team suggestions">
            {filteredTeams.map((team, idx) => (
              <li
                key={team.id}
                id={`team-option-${team.id}`}
                role="option"
                aria-selected={highlighted === idx}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                style={{ background: highlighted === idx ? 'rgba(255,255,255,0.08)' : undefined }}
                onMouseDown={() => {
                  onSelect(team)
                  setShowDropdown(false)
                  setHighlighted(-1)
                  setError(null)
                }}
                onMouseEnter={() => setHighlighted(idx)}
              >
                <span style={{ width: 38 }}>{highlightMatch(team.teamCode, value)}</span>
                <span style={{ flex: 1 }}>{highlightMatch(team.name, value)}</span>
                <span style={{ color: '#7e7e7e', fontSize: 12 }}>#{highlightMatch(String(team.id), value)}</span>
              </li>
            ))}
          </Dropdown>
        )}
      </InputRow>
    </form>
  )
}

export default TeamSearch

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin: 1rem 0 0.5rem;
  color: var(--heading);
  display: block;
`

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  input {
    flex: 1;
    padding: 0.55rem 0.8rem;
    border-radius: 0.5rem;
    border: 1px solid var(--accent);
    background: var(--dark-bg, #141414);
    color: inherit;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: var(--text-dark);
    }
  }
`

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--dark-bg, #141414);
  border: 1px solid var(--accent, #303030);
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.55rem 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    background: transparent;
    border: none;
    font: inherit;
    transition: background 0.15s;

    span {
      font-weight: normal;
    }

    &[aria-selected='true'],
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`
