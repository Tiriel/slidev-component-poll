<script lang="ts" setup>
import { computed, inject, isVNode, ref } from "vue";

import { useAnswers } from "../composables/useAnswers";
import { answersContext, idContext } from "../constants";

import PollResultQuiz from "./PollResultQuiz.vue";

const props = defineProps<{
  answers?: string[];
  controlled?: boolean;
  correctAnswer?: string | number | number[];
  multiple?: boolean;
  public?: boolean;
}>();
const id = inject(idContext, ref(""));
const context = inject(answersContext);

const renderAnswers = useAnswers(props.answers);

// Get answers in shuffled display order with their original indices
const shuffledAnswers = computed(() => {
  const order = context?.shuffleOrder.value ?? [];
  return order.map((originalIndex) => ({
    answer: renderAnswers.value[originalIndex],
    originalIndex,
  }));
});
</script>

<template>
  <ul class="poll-results-quiz mb-2">
    <PollResultQuiz
      v-for="{ answer, originalIndex } in shuffledAnswers"
      :key="originalIndex"
      :controlled="controlled"
      :correctAnswer="correctAnswer"
      :index="originalIndex"
      :multiple="multiple"
      :public="public"
    >
      <component v-if="isVNode(answer)" :is="answer" />
      <div v-else>{{ answer }}</div>
    </PollResultQuiz>
  </ul>
</template>

<style scoped>
.poll-results-quiz {
  --slidev-code-margin: 0;
  --prism-block-margin-y: 0;
}
</style>
