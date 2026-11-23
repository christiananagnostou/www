import { fork } from 'node:child_process'
import { once } from 'node:events'

export async function startBuiltApp() {
  // Isolate the real server, including any long-lived database connections.
  const child = fork(new URL('./serveBuilt.mjs', import.meta.url), [], { execArgv: [] })
  const exit = once(child, 'exit')
  const [origin] = await Promise.race([
    once(child, 'message'),
    exit.then(([code]) => {
      throw new Error(`Built app exited before startup (${code})`)
    }),
  ])
  return {
    origin,
    close: async () => {
      child.kill()
      await exit
    },
  }
}
