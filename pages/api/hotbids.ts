import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  try {
    const filePath = path.join(process.cwd(), 'public', 'scripts', 'hotbids.js')

    const fileContents = fs.readFileSync(filePath, 'utf-8')

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8')

    res.status(200).send(fileContents)
  } catch {
    res.status(500).send('Failed to load script')
  }
}
