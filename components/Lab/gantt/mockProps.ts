import dayjs from 'dayjs'
import { ItemProps } from '.'

// Sample items for the Gantt chart
const items: ItemProps[] = [
  {
    id: 1,
    startDate: dayjs().subtract(6, 'days'),
    endDate: dayjs().add(1, 'days'),
    title: 'Project Kickoff',
    barColor: '#ffc0cb',
    barLabel: 'Kickoff',
    parentId: undefined,
  },
  {
    id: 2,
    startDate: dayjs().subtract(3, 'days'),
    endDate: dayjs().add(2, 'days'),
    title: 'Core Development',
    barColor: '#e0bbff',
    barLabel: 'Development',
    parentId: 1,
  },
  {
    id: 3,
    startDate: dayjs().add(3, 'days'),
    endDate: dayjs().add(6, 'days'),
    title: 'Testing',
    barColor: '#ffdab9',
    barLabel: 'Testing',
    parentId: 2,
  },
  {
    id: 4,
    startDate: dayjs().add(7, 'days'),
    endDate: dayjs().add(10, 'days'),
    title: 'Review',
    barColor: '#e6e6fa',
    barLabel: 'Review',
    parentId: 2,
  },
  {
    id: 5,
    startDate: dayjs().subtract(5, 'days'),
    endDate: dayjs(),
    title: 'Preparation',
    barColor: '#b0e0e6',
    barLabel: 'Prep',
    parentId: 1,
  },
  {
    id: 6,
    startDate: dayjs().add(2, 'days'),
    endDate: dayjs().add(8, 'days'),
    title: 'Feature Enhancement',
    barColor: '#f08080',
    barLabel: 'Development',
    parentId: 1,
  },
  {
    id: 7,
    startDate: dayjs().add(9, 'days'),
    endDate: dayjs().add(12, 'days'),
    title: 'Testing',
    barColor: '#ffb6c1',
    barLabel: 'Testing',
    parentId: 6,
  },
  {
    id: 8,
    startDate: dayjs().add(13, 'days'),
    endDate: dayjs().add(16, 'days'),
    title: 'Review',
    barColor: '#98fb98',
    barLabel: 'Review',
    parentId: 6,
  },
  {
    id: 9,
    startDate: dayjs().add(17, 'days'),
    endDate: dayjs().add(21, 'days'),
    title: 'Final Integration',
    barColor: '#ffccff',
    barLabel: 'Integration',
    parentId: 1,
  },
  {
    id: 10,
    startDate: dayjs().add(22, 'days'),
    endDate: dayjs().add(26, 'days'),
    title: 'Project Launch',
    barColor: '#dd853f',
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
