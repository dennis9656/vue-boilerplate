<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import HomeIcon from '@/components/icons/shell/HomeIcon.vue'
import ListIcon from '@/components/icons/shell/ListIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { LOCALES, type Locale } from '@/lib/i18n'
import { useUiStore } from '@/stores/useUiStore'

const { t, locale } = useI18n()
const ui = useUiStore()

function switchLocale(next: Locale): void {
  ui.setLocale(next)
  locale.value = next
}
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-line bg-surface/85 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-5xl items-center gap-6 px-5">
      <RouterLink
        to="/"
        class="font-display text-lg tracking-tight text-ink transition-colors hover:text-accent"
      >
        {{ t('app.title') }}
      </RouterLink>

      <nav :aria-label="t('app.nav.home')" class="flex items-center gap-1">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-accent-soft hover:text-ink [&.router-link-exact-active]:text-ink"
        >
          <HomeIcon class="size-4" />
          {{ t('app.nav.home') }}
        </RouterLink>
        <RouterLink
          to="/samples"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-accent-soft hover:text-ink [&.router-link-active]:text-ink"
        >
          <ListIcon class="size-4" />
          {{ t('app.nav.samples') }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <div class="flex items-center gap-0.5" role="group" :aria-label="t('app.language')">
          <BaseButton
            v-for="code in LOCALES"
            :key="code"
            variant="ghost"
            size="sm"
            :class="locale === code ? 'text-ink' : ''"
            @click="switchLocale(code)"
          >
            {{ code.toUpperCase() }}
          </BaseButton>
        </div>
        <BaseButton
          variant="outline"
          size="sm"
          :aria-label="t('app.theme.toggle')"
          @click="ui.toggleTheme()"
        >
          {{ ui.isDark ? t('app.theme.dark') : t('app.theme.light') }}
        </BaseButton>
      </div>
    </div>
  </header>
</template>
