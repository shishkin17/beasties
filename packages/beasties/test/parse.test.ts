import { describe, expect, it, vi } from 'vitest'
import Beasties from '../src/index'

describe('selector normalisation', () => {
  it('should handle complex selectors', async () => {
    vi.spyOn(console, 'warn')
    const beasties = new Beasties()
    const result = await beasties.process(`
      <html>
        <body>
          <style> div > :not(.foo) > * { color:red; } </style>
          <style> div > :not(.foo) { color:red; } </style>
          <div>
            <div><div></div></div>
          </div>
        </body>
      </html>
    `)
    expect(result.replace(/^ {4}/gm, '')).toMatchInlineSnapshot(`
      "
        <html data-beasties-container>
          <body>
            <style>div > :not(.foo) > *{color:red}div > :not(.foo){color:red}</style>
            
            <div>
              <div><div></div></div>
            </div>
          </body>
        </html>
      "
    `)
    expect(console.warn).not.toBeCalled()
  })
})
