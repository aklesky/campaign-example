import preset from '@aklesky/tailwind-config/presets/full.js'
import { Config } from '@aklesky/tailwind-config/config.js'

const content = [
    ...((preset.content as string[]) || []),
    // './node_modules/preline/preline.js',
    // './node_modules/tw-elements-react/dist/js/**/*.js',
    'node_modules/flowbite-react/lib/esm/**/*.js',
]

export default {
    ...preset,
    content,
    darkMode: 'media',
    plugins: [
        ...(preset.plugins || []),
        // require('tw-elements-react/dist/plugin.cjs')
        require('flowbite/plugin'),
    ],
} satisfies Config
