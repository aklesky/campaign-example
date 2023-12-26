import { renderApp } from '@aklesky/react-presets/client/render.js'
import React from 'react'
import './index.scss'
import App from './app/app.js'
import { DispatchActionType } from './modules/campaigns/types.ts'

const worker = new Worker(new URL('./modules/campaigns/worker.ts', import.meta.url))

renderApp('root', () => (
    <React.StrictMode>
        <App worker={worker} />
    </React.StrictMode>
))

window.onbeforeunload = () => {
    worker.terminate()
}

window.addCampaigns = (campaigns: Item[]) => {
    worker.postMessage({ type: DispatchActionType.Add, state: [...campaigns] })
}
