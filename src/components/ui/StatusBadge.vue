<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/common/utils/cn'

const props = defineProps<{ tone: 'accent' | 'neutral'; label: string }>()

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-wide uppercase',
    props.tone === 'accent' ? 'bg-accent-soft text-accent' : 'bg-line/60 text-muted',
  ),
)
</script>

<template>
  <span :class="classes">{{ label }}</span>
</template>
