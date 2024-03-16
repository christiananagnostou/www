import styled from 'styled-components'

export const DailyCalendarStyle = styled.div`
  --border-color: var(--accent);
  --row-grid: 3rem 1fr;
  --blue: #1b72e8;
  --red: #fe2968;
  --resize-event-bg: #fff;
  --background: var(--body-bg);
  --header-curr-date-color: #fff;
  --daily-event-text-color: #000;
  --time-bar-width: 3.75rem;

  width: 100%;
  height: 50vh;
  margin: auto;
  overflow-x: hidden;
  user-select: none;

  .calendar__sticky-header {
    max-width: 100%;
    position: sticky;
    background: var(--background);
    top: 0;
    z-index: 5;
    border-bottom: 1px solid var(--border-color);
    display: grid;
    grid-template-columns: var(--row-grid);
    align-items: end;
  }

  .calendar__sticky-header--timezone {
    font-size: 8px;
    padding-bottom: 0.25rem;
    padding-left: 0.5rem;
    position: relative;
  }

  .calendar__sticky-header--date-wrap {
    padding: 0.25rem 1.25rem;
    display: grid;
    place-items: center;
    width: min-content;
  }

  .calendar__sticky-header--curr-day {
    color: var(--blue);
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .calendar__sticky-header--curr-date {
    height: 30px;
    width: 30px;
    border-radius: 100%;
    background: var(--blue);
    display: grid;
    place-items: center;
    font-size: 18px;
    color: var(--header-curr-date-color);
  }

  /* Hour Bar List */
  .calendar__hour-list-wrap {
    position: relative;
  }

  .calendar__hour-bar {
    height: var(--hour-bar-height);
    max-width: 100%;
    display: grid;
    position: relative;
    grid-template-columns: var(--row-grid);
  }

  .calendar__hour-bar:not(:last-child):after {
    content: '';
    width: 100%;
    border-bottom: 1px solid var(--border-color);
  }

  .calendar__hour-bar::before {
    content: '';
    display: block;
    width: 1px;
    height: var(--hour-bar-height);
    background: var(--border-color);
    position: absolute;
    top: 0;
    left: var(--time-bar-width);
  }

  .calendar__hour-bar--time {
    display: block;
    transform: translateY(-50%);
    height: 12px;
    font-size: 12px;
    line-height: 12px;
    padding-left: 0.5rem;
    background: var(--background);
    user-select: none;
    position: relative;
  }

  .calendar__sticky-header--timezone::after {
    content: '';
    display: block;
    width: 1px;
    height: var(--hour-bar-height);
    position: absolute;
    top: 0;
    left: var(--time-bar-width);
    background: var(--border-color);
  }

  /* Daily Event */
  .calendar__daily-event-container {
    position: absolute;
    z-index: 1;
    width: calc(100% - var(--time-bar-width));
    left: var(--time-bar-width);
    background: var(--red);
    border-radius: 3px;
  }

  .calendar__daily-event-container.selected {
    box-shadow: inset 0 0 0 1px #ccc;
    z-index: 4;
  }

  .calendar__daily-event-relative {
    position: relative;
    height: 100%;
    padding: 0.1rem 0.5rem;
    font-size: 12px;
  }

  .calendar__daily-event--time-range {
    color: var(--daily-event-text-color);
  }

  .calendar__resize-event--top,
  .calendar__resize-event--bottom {
    --height: 8px;
    background: var(--resize-event-bg);
    height: var(--height);
    width: 40px;
    border-radius: 10px;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    cursor: ns-resize;
  }

  .calendar__resize-event--bottom {
    bottom: calc(var(--height) / -2);
  }

  .calendar__resize-event--top {
    top: calc(var(--height) / -2);
  }

  /* Current Time Bar */
  .calendar__current-time {
    background: var(--red);
    width: 100%;
    height: 2px;
    position: absolute;
    z-index: 2;
    width: calc(100% - var(--time-bar-width));
    left: var(--time-bar-width);
    pointer-events: none;
  }

  .calendar__current-time::after {
    content: '';
    height: 12px;
    width: 12px;
    display: block;
    transform: translate(-50%, calc(-50% + 1px));
    border-radius: 10px;
    background: var(--red);
  }
`
