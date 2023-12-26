// noinspection JSUnusedGlobalSymbols

import preset from '@aklesky/vite-config/presets/base.js'
import { plugin } from '@aklesky/react-presets/plugins/vite.plugin.js'

const root = process.cwd()

const config = {
    ...preset,
    define: {
        DATE_FORMAT: JSON.stringify(process.env.DATE_FORMAT || 'mm/dd/yyyy'),
        DATE_PARSE_SEPARATOR: JSON.stringify(process.env.DATE_PARSE_SEPARATOR || '/'),
        TABLE_PAGE_SIZE: JSON.stringify(process.env.TABLE_PAGE_SIZE || '10'),
    },
    build: {
        emptyOutDir: true,
        outdir: `../dist`,
        rollupOptions: {
            optimizeDeps: {
                exclude: ['src/__tests__/**/*'],
            },
            output: {
                dir: `${root}/dist`,
            },
        },
    },
    plugins: [plugin()],
}

export default config
