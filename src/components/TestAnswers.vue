<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import "mathlive";

interface Question {
  id: number;
  option: string[];
  type: string;
  index: number;
}

// STATE SETUP
const route = useRoute();
const router = useRouter();

// REACTIVE DATA
const questions = ref<Question[]>([]);
const selectedChoiceAnswers = ref<Record<number, string>>({});
const writtenAnswers = ref<Record<number, string>>({});
const isSubmitting = ref(false);
const tgId = ref<string | null>(null);
const isSuccessOpen = ref(false);
const isErrorToastOpen = ref(false);
const errorToastMessage = ref<string>("");

// COMPUTED
const choiceQuestions = computed(() =>
  questions.value.filter((q) => q.type === "CHOICE")
);
const writtenQuestions = computed(() =>
  questions.value.filter((q) => q.type !== "CHOICE")
);
const TOTAL_QUESTIONS = computed(() => questions.value.length);
const completedCount = computed(() => {
  const choiceCount = Object.values(selectedChoiceAnswers.value).filter(
    Boolean
  ).length;
  const writtenCount = Object.values(writtenAnswers.value).filter(
    Boolean
  ).length;
  return choiceCount + writtenCount;
});

// METHODS
const selectChoiceAnswer = (questionId: number, choice: string) => {
  selectedChoiceAnswers.value = {
    ...selectedChoiceAnswers.value,
    [questionId]:
      selectedChoiceAnswers.value[questionId] === choice ? "" : choice,
  };
};

const onMathInput = (questionId: number, event: Event) => {
  const target = event.target as HTMLInputElement & { value: string };
  writtenAnswers.value = {
    ...writtenAnswers.value,
    [questionId]: target.value,
  };
};

const finishTest = async () => {
  if (isSubmitting.value) return;
  const taskNumber = route.params.task_number as string | undefined;
  if (!taskNumber) return;

  const choicePayload = Object.entries(selectedChoiceAnswers.value)
    .map(([question, answer]) => ({ question: Number(question), answer }))
    .filter((item) => item.answer && String(item.answer).trim() !== "");

  const writtenPayload = Object.entries(writtenAnswers.value)
    .map(([question, answer]) => ({ question: Number(question), answer }))
    .filter((item) => item.answer && String(item.answer).trim() !== "");

  const payload = {
    answers: [...choicePayload, ...writtenPayload],
    task_number: Number(taskNumber),
  };

  if (!payload.answers.length) return;

  try {
    isSubmitting.value = true;
    await axios.post(
      `http://dicore.uz:8796/api/v1/client/client_solving_test/?tg_id=${tgId.value}`,
      payload
    );
    isSuccessOpen.value = true;

    setTimeout(() => {
      goHome();
    }, 1500);
  } catch (error) {
    let message = "Error";
    if (axios.isAxiosError(error)) {
      const msg = (error.response?.data as any)?.msg;
      message = typeof msg === "string" ? msg : (error.message || "Error");
    } else if (error instanceof Error) {
      message = error.message || "Error";
    }
    errorToastMessage.value = message;
    isErrorToastOpen.value = true;
    setTimeout(() => {
      isErrorToastOpen.value = false;
    }, 3000);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push({ name: "home", query: { user_id: tgId.value } });
};

// LIFECYCLE
onMounted(async () => {
  // Theme DOM boshqaruvi endi App.vue da
  tgId.value = (route.query.user_id as string) || null;
  const taskNumber = route.params.task_number as string | undefined;
  if (!tgId.value || !taskNumber) return;
  try {
    const { data } = await axios.get(
      `http://dicore.uz:8796/api/v1/client/check_task/`,
      { params: { tg_id: tgId.value, task_number: taskNumber } }
    );
    questions.value = Array.isArray(data?.questions) ? data.questions : [];
  } catch (error) {
    console.error("Failed to fetch questions", error);
  }
});

// WATCH (global theme App.vue ga ko'chirilgan)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full">
      <!-- Header -->
      <div
        class="bg-white text-gray-900 dark:bg-gradient-to-r dark:from-gray-900 dark:to-slate-800 dark:text-white p-6 rounded-t-2xl flex items-center justify-center border-b border-gray-200 dark:border-slate-700"
      >
        <h1 class="text-xl sm:text-2xl font-bold text-center">Check Answers</h1>
      </div>

      <!-- Success dialog -->
      <div
        v-if="isSuccessOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        >
          <div
            class="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
          >
            <svg
              class="w-7 h-7 text-green-600"
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
          <h3 class="text-lg font-semibold mb-1">Successfully saved</h3>
          <p class="text-sm opacity-80">Test answers successfully saved.</p>
          <p v-if="route.params.task_number" class="mt-1 text-xs opacity-70">
            Test Code: {{ route.params.task_number }}
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              @click="goHome"
              class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 sm:p-8">
        <!-- Progress indicator -->
        <div class="mb-8">
          <div
            class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2"
          >
            <span>Answered Questions</span>
            <span>{{ completedCount }} / {{ TOTAL_QUESTIONS }}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(completedCount / TOTAL_QUESTIONS) * 100}%` }"
            ></div>
          </div>
        </div>

  <div
    v-if="isErrorToastOpen"
    class="fixed top-4 right-4 z-50 max-w-sm w-[90vw] sm:w-auto"
  >
    <div class="bg-red-600 text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-3">
      <svg class="w-5 h-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 011.5 0 .75.75 0 01-1.5 0zM10 6a.75.75 0 01.75.75v5a.75.75 0 01-1.5 0v-5A.75.75 0 0110 6z" clip-rule="evenodd" />
      </svg>
      <div class="text-sm font-medium">{{ errorToastMessage }}</div>
    </div>
  </div>

        <!-- Multiple Choice -->
        <div class="mb-12" v-if="choiceQuestions.length">
          <h2
            class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6"
          >
            Multiple Choice
          </h2>
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="(q, idx) in choiceQuestions"
              :key="q.id"
              class="flex items-center space-x-3 sm:space-x-4"
            >
              <div
                class="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base min-w-0 flex-shrink-0 w-8 sm:w-12"
              >
                {{ idx + 1 }}.
              </div>
              <div class="flex flex-nowrap gap-2 sm:gap-3 w-full">
                <button
                  v-for="choice in q.option"
                  :key="choice + q.id"
                  @click="selectChoiceAnswer(q.id, choice)"
                  :class="[
                    'flex-1 h-12 sm:h-14 md:h-16 rounded-xl border-2 font-semibold text-base sm:text-lg md:text-xl uppercase tracking-wide transition-all duration-200 flex items-center justify-center min-w-0',
                    selectedChoiceAnswers[q.id] === choice
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400',
                  ]"
                >
                  {{ choice }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Written (Math) -->
        <div class="mb-8" v-if="writtenQuestions.length">
          <h2
            class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6"
          >
            Written Questions
          </h2>
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="(q, idx) in writtenQuestions"
              :key="q.id"
              class="flex items-center space-x-3 sm:space-x-4"
            >
              <label
                class="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 min-w-0 flex-shrink-0 w-12 sm:w-16"
              >
                {{ idx + choiceQuestions.length + 1 }}.
              </label>
              <div class="flex-1">
                <math-field
                  :value="writtenAnswers[q.id] ?? ''"
                  @input="onMathInput(q.id, $event)"
                  class="w-full lg:w-1/3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                ></math-field>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goBack"
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back
          </button>
          <button
            @click="finishTest"
            class="px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
