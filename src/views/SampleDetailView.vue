<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import StateBlock from '@/components/custom/StateBlock.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useSampleDetail } from '@/features/sample/queries/composables/useSampleDetail'

const { t, d } = useI18n()
const route = useRoute()
const { data, isPending, isError, error, refetch } = useSampleDetail(() => Number(route.params.id))
</script>

<template>
  <section class="mx-auto max-w-3xl px-5 py-[var(--space-section)]">
    <RouterLink to="/samples" class="text-sm text-muted transition-colors hover:text-accent">
      ← {{ t('sample.detail.back') }}
    </RouterLink>

    <StateBlock v-if="isPending" class="mt-8" state="loading" />
    <StateBlock
      v-else-if="isError"
      class="mt-8"
      state="error"
      :message="error?.message"
      @retry="() => refetch()"
    />
    <article v-else-if="data" class="mt-8">
      <StatusBadge
        :tone="data.status === 'active' ? 'accent' : 'neutral'"
        :label="t(`sample.status.${data.status}`)"
      />
      <h1 class="mt-4 font-display text-5xl leading-none tracking-tight text-balance">
        {{ data.name }}
      </h1>
      <dl
        class="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
      >
        <div class="bg-raised p-5">
          <dt class="text-xs tracking-wide text-muted uppercase">{{ t('sample.detail.owner') }}</dt>
          <dd class="mt-1 text-lg">{{ data.ownerName }}</dd>
        </div>
        <div class="bg-raised p-5">
          <dt class="text-xs tracking-wide text-muted uppercase">
            {{ t('sample.detail.createdAt') }}
          </dt>
          <dd class="mt-1 text-lg">{{ d(new Date(data.createdAt), 'short') }}</dd>
        </div>
      </dl>
    </article>
  </section>
</template>
