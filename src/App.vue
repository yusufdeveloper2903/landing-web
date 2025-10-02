<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// STATE SETUP
const theme = ref<"light" | "dark">("light");

// METHODS
const applyThemeToDOM = (mode: "light" | "dark") => {
  const isDark = mode === "dark";
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
};

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
};

// LIFECYCLE
onMounted(() => {
  const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
  theme.value = saved;
  applyThemeToDOM(theme.value);
});

// WATCH
watch(
  () => theme.value,
  (val) => applyThemeToDOM(val)
);
</script>

<template>
  <button
    @click="toggleTheme"
    class="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-sm"
    aria-label="Toggle theme"
  >
    <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m8.485-8.485h-2.25M5.765 12H3.515m12.02 6.364-1.59-1.59M9.055 7.636 7.465 6.045m8.485 0-1.59 1.59M9.055 16.364l-1.59 1.59M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5z"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75 9.75 9.75 0 0 1 9.6 2.35 9.002 9.002 0 0 0 21.65 14.4a.6.6 0 0 1-.6.602z"/>
    </svg>
  </button>
  <router-view />
</template>

<style scoped>
/* App specific styles if needed */
</style>

