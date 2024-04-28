import dayjs from 'dayjs'
import { ItemProps } from '.'

// Sample items for the Gantt chart
const items: ItemProps[] = [
  {
    id: 1,
    startDate: dayjs().subtract(2, 'days'),
    endDate: dayjs().add(5, 'days'),
    title: 'Project Kickoff',
    barColor: '#ffc0cb', // Pastel Pink
    barLabel: 'Kickoff',
    parentId: undefined,
  },
  {
    id: 2,
    startDate: dayjs().add(1, 'days'),
    endDate: dayjs().add(6, 'days'),
    title: 'Core Development',
    barColor: '#e0bbff', // Pastel Purple
    barLabel: 'Development',
    parentId: 1,
  },
  {
    id: 3,
    startDate: dayjs().add(7, 'days'),
    endDate: dayjs().add(10, 'days'),
    title: 'Testing',
    barColor: '#ffdab9', // Pastel Orange
    barLabel: 'Testing',
    parentId: 2,
  },
  {
    id: 4,
    startDate: dayjs().add(11, 'days'),
    endDate: dayjs().add(14, 'days'),
    title: 'Review',
    barColor: '#e6e6fa', // Pastel Lilac
    barLabel: 'Review',
    parentId: 2,
  },
  {
    id: 5,
    startDate: dayjs().subtract(1, 'days'),
    endDate: dayjs().add(4, 'days'),
    title: 'Preparation',
    barColor: '#b0e0e6', // Pastel Mint
    barLabel: 'Prep',
    parentId: 1,
  },
  {
    id: 6,
    startDate: dayjs().add(6, 'days'),
    endDate: dayjs().add(12, 'days'),
    title: 'Feature Enhancement',
    barColor: '#f08080', // Pastel Coral
    barLabel: 'Development',
    parentId: 1,
  },
  {
    id: 7,
    startDate: dayjs().add(13, 'days'),
    endDate: dayjs().add(16, 'days'),
    title: 'Testing',
    barColor: '#ffb6c1', // Pastel Pink
    barLabel: 'Testing',
    parentId: 6,
  },
  {
    id: 8,
    startDate: dayjs().add(17, 'days'),
    endDate: dayjs().add(20, 'days'),
    title: 'Review',
    barColor: '#98fb98', // Pastel Green
    barLabel: 'Review',
    parentId: 6,
  },
  {
    id: 9,
    startDate: dayjs().add(21, 'days'),
    endDate: dayjs().add(25, 'days'),
    title: 'Final Integration',
    barColor: '#ffccff', // Pastel Magenta
    barLabel: 'Integration',
    parentId: 1,
  },
  {
    id: 10,
    startDate: dayjs().add(26, 'days'),
    endDate: dayjs().add(30, 'days'),
    title: 'Project Launch',
    barColor: '#dd853f', // Pastel Brown
    barLabel: 'Launch',
    parentId: 1,
  },
]

// Legend for the Gantt chart
const legend = [
  { label: 'Project Management', color: '#4caf50' },
  { label: 'Development', color: '#ff9800' },
  { label: 'Quality Assurance', color: '#f44336' },
]

// GanttProps data
const ganttProps = {
  items: items,
  defaultZoom: 25,
  chartTitle: 'Project Timeline',
  legend: legend,
}

export default ganttProps
