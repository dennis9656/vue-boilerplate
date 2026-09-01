<script setup lang="ts">
import { useId } from 'vue'

/** Label + control + error, wired together so the a11y plumbing is not optional. */
defineProps<{ label: string; error?: string | null; hideLabel?: boolean }>()

const id = useId()
const errorId = `${id}-error`
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      :for="id"
      :class="hideLabel ? 'sr-only' : 'text-xs font-medium tracking-wide text-muted'"
    >
      {{ label }}
    </label>
    <slot :id="id" :described-by="error ? errorId : undefined" />
    <p v-if="error" :id="errorId" class="text-xs text-danger">{{ error }}</p>
  </div>
</template>
