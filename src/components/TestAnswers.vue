<script setup lang="ts">
import { ref, computed } from "vue";

// Types
interface MultipleChoiceAnswer {
  id: number;
  question: string;
  selectedAnswer: string;
  type: "multiple";
}

interface WrittenAnswer {
  id: number;
  question: string;
  answer: string;
  type: "written";
}

// Constants
const ANSWER_CHOICES = ["A", "B", "C", "D"] as const;
const MULTIPLE_CHOICE_COUNT = 20;
const WRITTEN_QUESTIONS_COUNT = 10;
const TOTAL_QUESTIONS = MULTIPLE_CHOICE_COUNT + WRITTEN_QUESTIONS_COUNT;

// Reactive data
const multipleChoiceAnswers = ref<MultipleChoiceAnswer[]>(
  Array.from({ length: MULTIPLE_CHOICE_COUNT }, (_, index) => ({
    id: index + 1,
    question: `${index + 1}.`,
    selectedAnswer: "",
    type: "multiple" as const,
  }))
);

const writtenAnswers = ref<WrittenAnswer[]>(
  Array.from({ length: WRITTEN_QUESTIONS_COUNT }, (_, index) => ({
    id: MULTIPLE_CHOICE_COUNT + index + 1,
    question: `${MULTIPLE_CHOICE_COUNT + index + 1}.`,
    answer: "",
    type: "written" as const,
  }))
);

// Computed properties
const allAnswers = computed(() => [
  ...multipleChoiceAnswers.value,
  ...writtenAnswers.value,
]);

const isTestComplete = computed(
  () =>
    multipleChoiceAnswers.value.every(
      (answer) => answer.selectedAnswer !== ""
    ) && writtenAnswers.value.every((answer) => answer.answer.trim() !== "")
);

const completedCount = computed(
  () =>
    multipleChoiceAnswers.value.filter((a) => a.selectedAnswer).length +
    writtenAnswers.value.filter((a) => a.answer.trim()).length
);

// Methods
const selectAnswer = (questionId: number, choice: string) => {
  const answer = multipleChoiceAnswers.value.find((a) => a.id === questionId);
  if (answer) {
    answer.selectedAnswer = answer.selectedAnswer === choice ? "" : choice;
  }
};

const updateWrittenAnswer = (questionId: number, value: string) => {
  const answer = writtenAnswers.value.find((a) => a.id === questionId);
  if (answer) {
    answer.answer = value;
  }
};

const finishTest = () => {
  const completedMultipleChoice = multipleChoiceAnswers.value.filter(
    (a) => a.selectedAnswer
  );
  const completedWritten = writtenAnswers.value.filter((a) => a.answer.trim());

  console.log("Test completed:", {
    multipleChoice: completedMultipleChoice,
    written: completedWritten,
    total: completedCount.value,
  });
  // API call can be made here
};

const goBack = () => {
  emit("goBack");
};

// Emits
const emit = defineEmits<{
  goBack: [];
}>();
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

        <!-- Multiple Choice Questions (1-20) -->
        <div class="mb-12">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">
            Multiple Choice Questions (1-20)
          </h2>
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="answer in multipleChoiceAnswers"
              :key="answer.id"
              class="flex items-center space-x-3 sm:space-x-4"
            >
              <!-- Question number -->
              <div
                class="text-gray-700 font-medium text-sm sm:text-base min-w-0 flex-shrink-0 w-8 sm:w-12"
              >
                {{ answer.question }}
              </div>

              <!-- Answer choices -->
              <div class="flex space-x-1 sm:space-x-2">
                <button
                  v-for="choice in ANSWER_CHOICES"
                  :key="choice"
                  @click="selectAnswer(answer.id, choice)"
                  :class="[
                    'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg border-2 font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center',
                    answer.selectedAnswer === choice
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

        <!-- Written Questions (21-30) -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">
            Written Questions (21-30)
          </h2>
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="answer in writtenAnswers"
              :key="answer.id"
              class="flex items-center space-x-3 sm:space-x-4"
            >
              <label
                class="text-sm sm:text-base font-medium text-gray-700 min-w-0 flex-shrink-0 w-12 sm:w-16"
              >
                {{ answer.question }}
              </label>
              <div class="flex-1 relative">
                <input
                  :value="answer.answer"
                  @input="
                    updateWrittenAnswer(
                      answer.id,
                      ($event.target as HTMLInputElement).value
                    )
                  "
                  type="text"
                  class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 text-sm sm:text-base"
                  :placeholder="`Enter answer for ${answer.question}`"
                />
                <div
                  class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex space-x-1 sm:space-x-2"
                >
                  <button
                    class="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <button
                    class="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goBack"
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back
          </button>
          <button
            @click="finishTest"
            :disabled="!isTestComplete"
            :class="[
              'px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg',
              isTestComplete
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
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
