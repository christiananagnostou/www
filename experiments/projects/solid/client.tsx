/** @jsxImportSource @solidjs/web */
import { hydrate } from '@solidjs/web'
import { readPage } from '../directory'
import { wireHeader } from '../header'
import Directory from './Directory'

const { root, data, selected } = readPage()
hydrate(() => <Directory data={data} initial={selected} />, root)
wireHeader()
