import { describe, expect, it } from 'vitest'
import { parseStylesheet, serializeStylesheet } from '../src/css'

describe('serialize CSS AST', () => {
  it('should correctly minify empty property declarations', () => {
    const css = `
      * {
        --un-backdrop-saturate: ;
        --un-backdrop-sepia: ;
      }
      :not(.test) {
        height:inherit;
        width:inherit;
      }
    `
    const ast = parseStylesheet(css)

    expect(serializeStylesheet(ast, { compress: true })).toMatchInlineSnapshot(
      `"*{--un-backdrop-saturate: ;--un-backdrop-sepia: }:not(.test){height:inherit;width:inherit}"`,
    )
  })
})
