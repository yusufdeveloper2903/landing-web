<script setup lang="ts">
import { ref } from "vue";
import TestAnswers from './TestAnswers.vue'

const testCode = ref(275);
const showAnswers = ref(false);

const checkAnswers = () => {
  console.log("Javoblarni tekshirish:", testCode.value);
  showAnswers.value = true;
};

const openTelegram = () => {
  console.log("Telegram ochish");
};

const goBackToTest = () => {
  showAnswers.value = false;
};
</script>

<template>
  <div v-if="!showAnswers" class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
    <div
      class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-6 sm:mb-8 lg:mb-10">
        <div class="relative">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-gray-800 rounded-xl flex items-center justify-center shadow-lg"
          >
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-gray-800 rounded-lg flex items-center justify-center"
            >
              <div
                class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gray-800 rounded-full"
              ></div>
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h1
        class="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 text-center mb-6 sm:mb-8 lg:mb-10 leading-tight"
      >
        Javoblarni tekshirish
      </h1>

      <!-- Test Code Input -->
      <div class="mb-6 sm:mb-8 lg:mb-10">
        <label
          class="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-3 sm:mb-4"
        >
          Test kodi
        </label>
        <div class="relative">
          <input
            v-model.number="testCode"
            type="number"
            class="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-600 text-lg sm:text-xl lg:text-2xl font-medium transition-all duration-200 hover:border-gray-400"
            placeholder="275"
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="space-y-3 sm:space-y-4 lg:space-y-5">
        <button
          @click="checkAnswers"
          class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base lg:text-lg xl:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Javoblarni tekshirish
        </button>

        <button
          @click="openTelegram"
          class="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 active:from-blue-700 active:via-blue-800 active:to-indigo-800 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base lg:text-lg xl:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <div class="flex items-center justify-center space-x-2">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
              />
            </svg>
            <span>Telegram</span>
          </div>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Test Answers Page -->
  <TestAnswers v-if="showAnswers" @goBack="goBackToTest" />
</template>

<style scoped>
/* Custom styles if needed */
</style>
