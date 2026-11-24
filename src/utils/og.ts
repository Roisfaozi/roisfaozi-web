import fs from 'node:fs'
import path from 'node:path'
import satori, { type SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'
import type { BlogLang } from './blog'

export interface OgImageInput {
  title: string
  description: string
  category: string
  meta: string
  lang: BlogLang
  urlPath: string
}

let cachedFonts: SatoriOptions['fonts'] | null = null

function loadOgFonts(): SatoriOptions['fonts'] {
  if (cachedFonts) return cachedFonts

  const root = process.cwd()
  const geistSans400 = fs.readFileSync(
    path.join(root, 'node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff'),
  )
  const geistSans600 = fs.readFileSync(
    path.join(root, 'node_modules/@fontsource/geist-sans/files/geist-sans-latin-600-normal.woff'),
  )
  const geistSans700 = fs.readFileSync(
    path.join(root, 'node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff'),
  )
  const geistMono400 = fs.readFileSync(
    path.join(root, 'node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff'),
  )

  cachedFonts = [
    { name: 'Geist Sans', data: geistSans400, weight: 400, style: 'normal' },
    { name: 'Geist Sans', data: geistSans600, weight: 600, style: 'normal' },
    { name: 'Geist Sans', data: geistSans700, weight: 700, style: 'normal' },
    { name: 'Geist Mono', data: geistMono400, weight: 400, style: 'normal' },
  ]
  return cachedFonts
}

function truncateText(value: string, maxChars: number): string {
  const clean = value.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxChars) return clean
  const sliced = clean.slice(0, maxChars - 3).trimEnd()
  const lastSpace = sliced.lastIndexOf(' ')
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced)}...`
}

function titleFontSize(title: string): number {
  if (title.length > 76) return 44
  if (title.length > 56) return 48
  return 54
}

export async function renderOgPng(input: OgImageInput): Promise<Buffer> {
  const fonts = loadOgFonts()
  const safeTitle = truncateText(input.title, 105)
  const safeDescription = truncateText(input.description, 155)
  const fontSize = titleFontSize(safeTitle)

  const element = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        boxSizing: 'border-box',
        backgroundColor: '#09090b',
        padding: '32px',
        fontFamily: 'Geist Sans',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '1136px',
              height: '566px',
              display: 'flex',
              boxSizing: 'border-box',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#111113',
              border: '1px solid #27272a',
              borderRadius: '24px',
              padding: '44px 52px',
            },
            children: [
              // Top bar + accent rule
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                              },
                              children: [
                                {
                                  type: 'svg',
                                  props: {
                                    width: 46,
                                    height: 20,
                                    viewBox: '0 0 73 32',
                                    fill: 'none',
                                    children: [
                                      {
                                        type: 'path',
                                        props: {
                                          d: 'M10.72 28.7L0.16 18.14L10.72 7.58L14.02 10.858L6.496 18.14L14.02 25.422L10.72 28.7ZM62.4135 28.7L59.1355 25.422L66.6375 18.14L59.1355 10.858L62.4135 7.58L72.9955 18.14L62.4135 28.7Z',
                                          fill: '#8B8B93',
                                        },
                                      },
                                      {
                                        type: 'path',
                                        props: {
                                          d: 'M25.1386 32V0.319999H38.2286C38.5366 0.319999 38.9326 0.334665 39.4166 0.363998C39.9006 0.378666 40.3479 0.422666 40.7586 0.495999C42.5919 0.774665 44.1026 1.38333 45.2906 2.322C46.4933 3.26066 47.3806 4.44867 47.9526 5.886C48.5393 7.30867 48.8326 8.89267 48.8326 10.638C48.8326 13.2193 48.1799 15.4413 46.8746 17.304C45.5693 19.152 43.5673 20.296 40.8686 20.736L38.6026 20.934H30.4406V32H25.1386ZM43.3326 32L37.0846 19.108L42.4746 17.92L49.3386 32H43.3326ZM30.4406 15.984H38.0086C38.3019 15.984 38.6319 15.9693 38.9986 15.94C39.3653 15.9107 39.7026 15.852 40.0106 15.764C40.8906 15.544 41.5799 15.1553 42.0786 14.598C42.5919 14.0407 42.9513 13.41 43.1566 12.706C43.3766 12.002 43.4866 11.3127 43.4866 10.638C43.4866 9.96333 43.3766 9.274 43.1566 8.57C42.9513 7.85133 42.5919 7.21333 42.0786 6.656C41.5799 6.09867 40.8906 5.71 40.0106 5.49C39.7026 5.402 39.3653 5.35067 38.9986 5.336C38.6319 5.30667 38.3019 5.292 38.0086 5.292H30.4406V15.984Z',
                                          fill: '#F4F4F5',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontFamily: 'Geist Mono',
                                      fontSize: '20px',
                                      color: '#d4d4d8',
                                    },
                                    children: 'roisfaozi.com',
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontFamily: 'Geist Mono',
                                fontSize: '18px',
                                color: '#34d399',
                              },
                              children: [
                                {
                                  type: 'span',
                                  props: {
                                    children: input.category,
                                  },
                                },
                                {
                                  type: 'span',
                                  props: {
                                    style: { color: '#52525b' },
                                    children: '/',
                                  },
                                },
                                {
                                  type: 'span',
                                  props: {
                                    style: { color: '#e4e4e7' },
                                    children: input.lang.toUpperCase(),
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '64px',
                          height: '4px',
                          backgroundColor: '#10b981',
                          borderRadius: '2px',
                          marginTop: '28px',
                        },
                      },
                    },
                  ],
                },
              },

              // Title & description block
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'Geist Sans',
                          fontWeight: 700,
                          fontSize: `${fontSize}px`,
                          lineHeight: 1.15,
                          letterSpacing: '-0.025em',
                          color: '#fafafa',
                        },
                        children: safeTitle,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'Geist Sans',
                          fontWeight: 400,
                          fontSize: '22px',
                          lineHeight: 1.45,
                          color: '#a1a1aa',
                        },
                        children: safeDescription,
                      },
                    },
                  ],
                },
              },

              // Footer metadata bar
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #27272a',
                    paddingTop: '24px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontWeight: 600,
                                fontSize: '20px',
                                color: '#f4f4f5',
                              },
                              children: 'Rois Faozi',
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontFamily: 'Geist Mono',
                                fontSize: '15px',
                                color: '#a1a1aa',
                              },
                              children: 'Full-Stack Developer (Go & TypeScript)',
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '4px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontFamily: 'Geist Mono',
                                fontSize: '17px',
                                color: '#e4e4e7',
                              },
                              children: input.meta,
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontFamily: 'Geist Mono',
                                fontSize: '15px',
                                color: '#34d399',
                              },
                              children: input.urlPath,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }

  // Satori accepts plain React-element-shaped vnodes at runtime
  const svg = await satori(element as never, {
    width: 1200,
    height: 630,
    fonts,
  })

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  })

  return Buffer.from(resvg.render().asPng())
}
