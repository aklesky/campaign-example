import { defineConfig } from '@aklesky/postcss-config/config.js'
import { withAutoPrefix } from '@aklesky/postcss-config/plugins/autoprefixer.js'
import { withCssNano } from '@aklesky/postcss-config/plugins/cssnano.js'
import { withNesting } from '@aklesky/postcss-config/plugins//nesting.js'
import { withTailwindPlugin } from '@aklesky/tailwind-config/plugin.js'

export default defineConfig(withTailwindPlugin(), withAutoPrefix(), withNesting(), withCssNano())
