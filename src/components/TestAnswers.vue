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
    router.push({ name: "home", query: { user_id: tgId.value } });
  } catch (error) {
    console.error("Failed to submit answers", error);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.back();
};

// LIFECYCLE
onMounted(async () => {
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
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-6xl">
      <!-- Header -->
      <div class="bg-gray-800 text-white p-6 rounded-t-2xl">
        <h1 class="text-xl sm:text-2xl font-bold text-center">Check Answers</h1>
      </div>

      <!-- Content -->
      <div class="p-6 sm:p-8">
        <!-- Progress indicator -->
        <div class="mb-8">
          <div
            class="flex items-center justify-between text-sm text-gray-600 mb-2"
          >
            <span>Answered Questions</span>
            <span>{{ completedCount }} / {{ TOTAL_QUESTIONS }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(completedCount / TOTAL_QUESTIONS) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Multiple Choice -->
        <div class="mb-12" v-if="choiceQuestions.length">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">
            Multiple Choice
          </h2>
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="(q, idx) in choiceQuestions"
              :key="q.id"
              class="flex items-center space-x-3 sm:space-x-4"
            >
              <div
                class="text-gray-700 font-medium text-sm sm:text-base min-w-0 flex-shrink-0 w-8 sm:w-12"
              >
                {{ idx + 1 }}.
              </div>
              <div class="flex space-x-1 sm:space-x-2">
                <button
                  v-for="choice in q.option"
                  :key="choice + q.id"
                  @click="selectChoiceAnswer(q.id, choice)"
                  :class="[
                    'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg border-2 font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center',
                    selectedChoiceAnswers[q.id] === choice
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400',
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
          <h2 class="text-lg font-semibold text-gray-800 mb-6">
            Written Questions
          </h2>
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="(q, idx) in writtenQuestions"
              :key="q.id"
              class="flex items-center space-x-3 sm:space-x-4"
            >
              <label
                class="text-sm sm:text-base font-medium text-gray-700 min-w-0 flex-shrink-0 w-12 sm:w-16"
              >
                {{ idx + choiceQuestions.length + 1 }}.
              </label>
              <div class="flex-1">
                <math-field
                  :value="writtenAnswers[q.id] ?? ''"
                  @input="onMathInput(q.id, $event)"
                  class="w-full lg:w-1/3 border border-gray-300 rounded-lg"
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
