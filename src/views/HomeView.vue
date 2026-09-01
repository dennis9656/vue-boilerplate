<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()

/** Layout and composition only. Domain logic belongs in `features/`. */
const PILLARS = ['fetch', 'query', 'url', 'msw'] as const
</script>

<template>
  <section class="mx-auto max-w-5xl px-5 py-[var(--space-section)]">
    <p class="mb-4 text-xs font-medium tracking-[0.2em] text-accent uppercase">Vue 3 · Vite · TS</p>
    <h1
      class="font-display text-[length:var(--text-hero)] leading-[0.95] tracking-tight text-balance"
    >
      {{ t('app.title') }}
    </h1>
    <p class="mt-6 max-w-xl text-base leading-relaxed text-muted">
      {{ t('home.lede') }}
    </p>

    <div class="mt-9">
      <RouterLink to="/samples">
        <BaseButton>{{ t('app.nav.samples') }}</BaseButton>
      </RouterLink>
    </div>

    <ul
      class="mt-[var(--space-section)] grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
    >
      <li v-for="(key, index) in PILLARS" :key="key" class="bg-raised p-6">
        <span class="font-display text-3xl text-accent/60">{{
          String(index + 1).padStart(2, '0')
        }}</span>
        <h2 class="mt-3 text-sm font-medium tracking-tight">
          {{ t(`home.pillars.${key}.title`) }}
        </h2>
        <p class="mt-1.5 text-sm leading-relaxed text-muted">{{ t(`home.pillars.${key}.body`) }}</p>
      </li>
    </ul>
  </section>
</template>
