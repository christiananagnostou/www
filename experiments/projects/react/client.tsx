import { hydrateRoot } from 'react-dom/client'
import { readPage } from '../directory'
import { wireHeader } from '../header'
import Directory from './Directory'

const { root, data, selected } = readPage()
hydrateRoot(root, <Directory data={data} initial={selected} />)
wireHeader()
