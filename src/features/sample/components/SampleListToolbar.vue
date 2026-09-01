<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'

import { SAMPLE_STATUSES, type SampleListFilters, type SampleStatus } from '../types/sample'

/**
 * A screen-specific fragment with domain meaning, so it lives in the domain —
 * not under `views/`, even though exactly one view renders it.
 */
const props = defineProps<{ filters: SampleListFilters }>()
const emit = defineEmits<{ patch: [next: Partial<SampleListFilters>]; reset: [] }>()

const { t } = useI18n()

function onSearch(event: Event): void {
  emit('patch', { q: (event.target as HTMLInputElement).value })
}

function onStatus(status: SampleStatus | null): void {
  emit('patch', { status: props.filters.status === status ? null : status })
}
</script>

<template>
  <div class="flex flex-wrap items-end gap-4">
    <BaseField :label="t('sample.list.searchLabel')" hide-label class="min-w-56 flex-1">
      <template #default="{ id }">
        <input
          :id="id"
          type="search"
          :value="filters.q"
          :placeholder="t('sample.list.search')"
          class="h-10 w-full rounded-full border border-line bg-raised px-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
          @input="onSearch"
        />
      </template>
    </BaseField>

    <div class="flex items-center gap-1.5" role="group" :aria-label="t('sample.list.statusLabel')">
      <BaseButton
        v-for="status in SAMPLE_STATUSES"
        :key="status"
        size="sm"
        :variant="filters.status === status ? 'primary' : 'outline'"
        :aria-pressed="filters.status === status"
        @click="onStatus(status)"
      >
        {{ t(`sample.list.status.${status}`) }}
      </BaseButton>
      <BaseButton size="sm" variant="ghost" @click="emit('reset')">
        {{ t('sample.list.reset') }}
      </BaseButton>
    </div>
  </div>
</template>
