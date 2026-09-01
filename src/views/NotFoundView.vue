<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-3xl px-5 py-[var(--space-section)]">
    <p class="font-display text-[length:var(--text-hero)] leading-none text-accent/30">404</p>
    <h1 class="mt-4 font-display text-3xl tracking-tight">{{ t('notFound.title') }}</h1>
    <p class="mt-3 text-muted">{{ t('notFound.description') }}</p>
    <RouterLink to="/" class="mt-8 inline-block">
      <BaseButton variant="outline">{{ t('notFound.back') }}</BaseButton>
    </RouterLink>
  </section>
</template>
