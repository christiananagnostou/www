import { once } from 'node:events'
import { createServer } from 'node:http'
import next from 'next'

const hostname = '127.0.0.1'
const server = createServer().listen(0, hostname)
await once(server, 'listening')
const port = server.address().port
const app = next({ dev: false, hostname, port })
await app.prepare()
server.on('request', app.getRequestHandler())
process.once('disconnect', () => process.exit(0))
process.send(`http://${hostname}:${port}`)
