<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/common/utils/cn'

/**
 * The design-system button. A raw `<button>` in a feature is a review finding
 * (rules/web/stack-standards.md) — states belong in one place, not re-invented
 * per screen.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'outline'
    size?: 'sm' | 'md'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false },
)

defineEmits<{ click: [event: MouseEvent] }>()

const VARIANTS = {
  primary:
    'bg-ink text-surface hover:-translate-y-px hover:shadow-[0_6px_20px_-8px_var(--app-ink)] active:translate-y-0',
  outline: 'border border-line text-ink hover:border-accent hover:text-accent',
  ghost: 'text-muted hover:bg-accent-soft hover:text-ink',
} as const

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
} as const

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight',
    'transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]',
    'disabled:pointer-events-none disabled:opacity-40',
    VARIANTS[props.variant],
    SIZES[props.size],
  ),
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
