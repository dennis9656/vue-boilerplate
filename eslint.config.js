import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**', 'public/mockServiceWorker.js'],
  },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'app/rules',
    rules: {
      // rules/vue-spa/security.md — every use must be an explicit, reviewable exception
      'vue/no-v-html': 'error',
      // rules/vue-spa/coding-style.md — single-word names collide with HTML elements
      'vue/multi-word-component-names': 'error',
      // rules/web/stack-standards.md — the project logger, never console
      'no-console': 'error',
      // rules/web/stack-standards.md — native fetch only
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'axios' }, { name: 'ky' }, { name: 'got' }] },
      ],
    },
  },
  {
    // rules/vue-spa/patterns.md — server state does not live in Pinia.
    // Enforced at write time instead of at review.
    name: 'app/stores-hold-no-server-state',
    files: ['src/stores/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/http', '**/lib/http', '@/features/*/api/*', '**/api/*'],
              message: 'Server state belongs to the query layer, not to a Pinia store.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'app/logger-may-use-console',
    files: ['src/lib/logger.ts'],
    rules: { 'no-console': 'off' },
  },
)
