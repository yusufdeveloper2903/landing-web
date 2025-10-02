<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const testCode = ref<number | null>(null);
const tgId = ref<string | null>(null);
const errorMessage = ref<string>("");

const checkAnswers = async () => {
  if (!tgId.value || !testCode.value) return;
  try {
     await axios.get(
      `http://dicore.uz:8796/api/v1/client/check_task/`,
      { params: { tg_id: tgId.value, task_number: String(testCode.value) } }
    );

    router.push({
      name: "answers",
      params: { task_number: String(testCode.value) },
      query: { user_id: tgId.value },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const msg = (error.response?.data as any)?.msg;
      errorMessage.value = typeof msg === "string" ? msg : "Error";
    } else {
      errorMessage.value = "Error";
    }
  }
};

const openTelegram = () => {
  console.log("Open Telegram");
};

const sendClient = async (tgId: string) => {
  try {
    await axios.post(`http://dicore.uz:8796/api/v1/client/client/`, {
      tg_id: tgId,
    });
  } catch (error) {
    console.error("Failed to send tg_id", error);
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("user_id");
  tgId.value = id;
  if (id) {
    sendClient(id);
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 w-full"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-6 sm:mb-8 lg:mb-10">
        <div class="relative">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-gray-800 dark:border-gray-200 rounded-xl flex items-center justify-center shadow-lg relative bg-white dark:bg-gray-900"
          >
            <svg
              class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-800 dark:text-gray-100"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="3"
                width="16"
                height="18"
                rx="3"
                ry="3"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M9 7h6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M7 12l3 3 7-7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div
              class="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h1
        class="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6 sm:mb-8 lg:mb-10 leading-tight"
      >
        Check Answers
      </h1>
      <!-- Test Code Input -->
      <div class="mb-6 sm:mb-8 lg:mb-10">
        <label
          class="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4"
        >
          Test Code
        </label>
        <div class="relative">
          <input
            v-model.number="testCode"
            type="number"
            class="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 border-2 border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-600 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 text-lg sm:text-xl lg:text-2xl font-medium transition-all duration-200 hover:border-gray-400"
            placeholder="275"
          />
          <p v-if="errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="space-y-3 sm:space-y-4 lg:space-y-5">
        <button
          @click="checkAnswers"
          class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base lg:text-lg xl:text-xl shadow-lg hover:shadow-xl"
        >
          Check Answers
        </button>

        <button
          @click="openTelegram"
          class="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 active:from-blue-700 active:via-blue-800 active:to-indigo-800 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base lg:text-lg xl:text-xl shadow-lg hover:shadow-xl"
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
</template>

<style scoped>
/* Custom styles if needed */
</style>
