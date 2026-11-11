/** Run with `npx tsx src/lib/tech.selfcheck.ts` (same convention as localCache.selfcheck.ts). */
import assert from 'node:assert/strict'
import { techKey } from './tech'

const same = (a: string, b: string) => assert.equal(techKey(a), techKey(b), `${a} should match ${b}`)
const differ = (a: string, b: string) => assert.notEqual(techKey(a), techKey(b), `${a} should not match ${b}`)

same('React.js', 'React 19')
same('React.js', 'React')
same('Tailwind CSS', 'Tailwind CSS v4')
same('Socket.IO', 'Socket.io')
same('Dexie / IndexedDB', 'Dexie')
same('Svelte', 'Svelte 5')
same('Express.js', 'Express')
same('Swift', 'Swift 6')

differ('React.js', 'React Native')
differ('Swift', 'SwiftUI')
differ('Swift', 'Swift Testing')
differ('Next.js', 'Node.js')

console.log('tech.selfcheck ok')
