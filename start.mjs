import { readFileSync, existsSync } from 'node:fs'
import { spawn } from 'node:child_process'

if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (match && !match[1].startsWith('#') && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
    }
  }
}
const port = process.env.APP_PORT || '3000'
const child = spawn('bun', ['.output/server/index.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port, NITRO_PORT: port }
})
child.on('exit', code => process.exit(code ?? 0))
