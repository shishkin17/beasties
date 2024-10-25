import fs from 'node:fs'
import path from 'node:path'

import { bench, describe } from 'vitest'
import Beasties from '../src/index'

function trim(s) {
  return s[0]
    .trim()
    .replace(new RegExp(`^${s[0].match(/^( {2}|\t)+/m)[0]}`, 'gm'), '')
}

describe('beasties', () => {
  bench('basic Usage', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: '/',
    })
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
        h2.unused { color: red; }
        p { color: purple; }
        p.unused { color: orange; }
      `,
    }
    beasties.readFile = filename => assets[filename]
    await beasties.process(trim`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Hello World!</h1>
          <p>This is a paragraph</p>
        </body>
      </html>
    `)
  })

  const basicHTML = fs.readFileSync(
    path.join(__dirname, 'src/index.html'),
    'utf8',
  )

  bench('run on HTML file', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: path.join(__dirname, 'src'),
    })

    await beasties.process(basicHTML)
  })

  bench('does not encode HTML', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: '/',
    })
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
      `,
    }
    beasties.readFile = filename => assets[filename]
    await beasties.process(trim`
      <html>
        <head>
          <title>$title</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `)
  })

  bench('should keep existing link tag attributes in the noscript link', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: '/',
      preload: 'media',
    })
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
      `,
    }
    beasties.readFile = filename => assets[filename]
    await beasties.process(trim`
      <html>
        <head>
          <title>$title</title>
          <link rel="stylesheet" href="/style.css" crossorigin="anonymous" integrity="sha384-j1GsrLo96tLqzfCY+">
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `)
  })

  bench('should keep existing link tag attributes', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: '/',
    })
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
      `,
    }
    beasties.readFile = filename => assets[filename]
    await beasties.process(trim`
      <html>
        <head>
          <title>$title</title>
          <link rel="stylesheet" href="/style.css" crossorigin="anonymous" integrity="sha384-j1GsrLo96tLqzfCY+">
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `)
  })

  bench('does not decode entities in HTML document', async () => {
    const beasties = new Beasties({
      path: '/',
    })
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
        h2.unused { color: red; }
        p { color: purple; }
        p.unused { color: orange; }
      `,
    }
    beasties.readFile = filename => assets[filename]
    await beasties.process(trim`
      <html>
        <body>
          &lt;h1&gt;Hello World!&lt;/h1&gt;
        </body>
      </html>
    `)
  })

  const mediaValidationHtml = fs.readFileSync(
    path.join(__dirname, 'src/media-validation.html'),
    'utf8',
  )
  bench('prevent injection via media attr', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: path.join(__dirname, 'src'),
      preload: 'media',
    })

    await beasties.process(mediaValidationHtml)
  })

  const invalidPathHtml = fs.readFileSync(
    path.join(__dirname, 'src/subpath-validation.html'),
    'utf8',
  )
  bench('skip invalid path', async () => {
    const beasties = new Beasties({
      reduceInlineStyles: false,
      path: path.join(__dirname, 'src'),
    })

    await beasties.process(invalidPathHtml)
  })
})
