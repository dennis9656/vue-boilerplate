<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import StateBlock from '@/components/custom/StateBlock.vue'
import SampleCard from '@/features/sample/components/SampleCard.vue'
import SampleCreateForm from '@/features/sample/components/SampleCreateForm.vue'
import SampleListToolbar from '@/features/sample/components/SampleListToolbar.vue'
import { useSampleFilters } from '@/features/sample/composables/useSampleFilters'
import { useSampleList } from '@/features/sample/queries/composables/useSampleList'

const { t } = useI18n()
const { filters, patch, reset } = useSampleFilters()
// A getter, not `filters.value` — the key has to stay reactive.
const { data, isPending, isError, error, refetch } = useSampleList(() => filters.value)
</script>

<template>
  <section class="mx-auto max-w-5xl px-5 py-[var(--space-section)]">
    <header class="flex flex-wrap items-baseline justify-between gap-3">
      <h1 class="font-display text-4xl tracking-tight">{{ t('sample.list.title') }}</h1>
      <p class="text-sm text-muted">
        {{ t('sample.list.subtitle', { count: data?.meta.total ?? 0 }) }}
      </p>
    </header>

    <div class="mt-8 flex flex-col gap-4">
      <SampleListToolbar :filters="filters" @patch="patch" @reset="reset" />
      <SampleCreateForm />
    </div>

    <div class="mt-8">
      <StateBlock v-if="isPending" state="loading" />
      <StateBlock
        v-else-if="isError"
        state="error"
        :message="error?.message"
        @retry="() => refetch()"
      />
      <StateBlock v-else-if="!data?.items.length" state="empty" />
      <ul v-else class="grid gap-4 sm:grid-cols-2">
        <li v-for="sample in data.items" :key="sample.id">
          <SampleCard :sample="sample" />
        </li>
      </ul>
    </div>
  </section>
</template>
