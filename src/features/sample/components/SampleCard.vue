<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import StatusBadge from '@/components/ui/StatusBadge.vue'

import type { Sample } from '../types/sample'

defineProps<{ sample: Sample }>()

const { t, d } = useI18n()
</script>

<template>
  <RouterLink
    :to="{ name: 'sample-detail', params: { id: sample.id } }"
    class="group flex flex-col gap-3 rounded-2xl border border-line bg-raised p-5 transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-28px_var(--app-ink)]"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="font-display text-xl leading-tight tracking-tight group-hover:text-accent">
        {{ sample.name }}
      </h3>
      <StatusBadge
        :tone="sample.status === 'active' ? 'accent' : 'neutral'"
        :label="t(`sample.status.${sample.status}`)"
      />
    </div>
    <dl class="flex items-center gap-4 text-xs text-muted">
      <div class="flex gap-1.5">
        <dt>{{ t('sample.detail.owner') }}</dt>
        <dd class="text-ink">{{ sample.ownerName }}</dd>
      </div>
      <div class="flex gap-1.5">
        <dt>{{ t('sample.detail.createdAt') }}</dt>
        <dd>{{ d(new Date(sample.createdAt), 'short') }}</dd>
      </div>
    </dl>
  </RouterLink>
</template>
