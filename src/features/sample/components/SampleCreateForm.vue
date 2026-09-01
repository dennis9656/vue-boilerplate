<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'

import { useCreateSample } from '../queries/composables/useCreateSample'

const { t } = useI18n()
const { mutate, isPending, isError, error } = useCreateSample()

const name = ref('')
const validationError = ref<string | null>(null)

function submit(): void {
  const trimmed = name.value.trim()
  // Validate at the boundary; the backend validates again, and that one counts.
  if (!trimmed) {
    validationError.value = t('sample.create.nameRequired')
    return
  }

  validationError.value = null
  mutate({ name: trimmed }, { onSuccess: () => (name.value = '') })
}
</script>

<template>
  <form class="flex flex-wrap items-end gap-3" @submit.prevent="submit">
    <BaseField
      :label="t('sample.create.name')"
      :error="validationError ?? (isError ? error?.message : null)"
      class="min-w-56 flex-1"
    >
      <template #default="{ id, describedBy }">
        <input
          :id="id"
          v-model="name"
          type="text"
          :aria-describedby="describedBy"
          :placeholder="t('sample.create.namePlaceholder')"
          class="h-10 w-full rounded-full border border-line bg-raised px-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </template>
    </BaseField>
    <BaseButton type="submit" :disabled="isPending">
      {{ isPending ? t('sample.create.submitting') : t('sample.create.submit') }}
    </BaseButton>
  </form>
</template>
