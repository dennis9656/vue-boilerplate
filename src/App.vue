<script setup lang="ts">
import AppHeader from '@/components/custom/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-full flex-col">
    <AppHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </RouterView>
    </main>
    <footer class="border-t border-line py-8 text-center text-xs text-muted">rules/vue-spa</footer>
  </div>
</template>
