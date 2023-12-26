import { PropsWithChildren, Suspense, memo, lazy } from 'react'
import { CampaignProviderProps } from '../modules/campaigns/types.ts'

const CampaignProvider = lazy(() => import('../modules/campaigns/provider.js'))
const CampaignView = lazy(() => import('../modules/campaigns/campaigns.tsx'))

const AppView = (props: PropsWithChildren<CampaignProviderProps>) => {
    return (
        <div className="container mx-auto px-1">
            <Suspense>
                <CampaignProvider worker={props.worker}>
                    <Suspense>
                        <CampaignView />
                    </Suspense>
                </CampaignProvider>
            </Suspense>
        </div>
    )
}

export const App = memo(AppView)

export default App
