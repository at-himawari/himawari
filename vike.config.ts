import type { Config } from 'vike/types'
import vikeReact from 'vike-react'

const config: Config = {
  extends: [vikeReact],
  prerender: true,
  meta: {
    title: {
      env: { server: true }
    },
    description: {
      env: { server: true }
    },
    coverImage: {
      env: { server: true }
    }
  }
}

export default config