<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'

/** Loading / empty / error, in one place so every screen fails the same way. */
defineProps<{ state: 'loading' | 'empty' | 'error'; message?: string | null }>()
defineEmits<{ retry: [] }>()

const { t } = useI18n()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-14 text-center"
  >
    <p v-if="state === 'loading'" class="text-sm text-muted">{{ t('state.loading') }}</p>
    <p v-else-if="state === 'empty'" class="text-sm text-muted">{{ t('state.empty') }}</p>
    <template v-else>
      <p class="text-sm text-danger">{{ message || t('state.error') }}</p>
      <BaseButton variant="outline" size="sm" @click="$emit('retry')">
        {{ t('state.retry') }}
      </BaseButton>
    </template>
  </div>
</template>
