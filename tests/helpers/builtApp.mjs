import { once } from 'node:events'
import { createServer } from 'node:http'
import next from 'next'

export async function startBuiltApp() {
  const hostname = '127.0.0.1'
  const app = next({ dev: false, hostname })
  await app.prepare()
  const server = createServer(app.getRequestHandler()).listen(0, hostname)
  await once(server, 'listening')

  return {
    origin: `http://${hostname}:${server.address().port}`,
    async close() {
      await new Promise((resolve) => server.close(resolve))
      await app.close()
    },
  }
}
