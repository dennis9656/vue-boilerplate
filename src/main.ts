import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import { IS_MSW_ENABLED } from '@/common/constants/env'
import { i18n } from '@/lib/i18n'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'
import '@/styles/main.css'

async function bootstrap(): Promise<void> {
  if (IS_MSW_ENABLED) {
    // Browser-side interception: with no server hop, the browser's own request
    // *is* the request to the backend (rules/vue-spa/testing.md).
    const { worker } = await import('../__mocks__/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createApp(App)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .use(VueQueryPlugin, { queryClient })
    .mount('#app')
}

void bootstrap()
