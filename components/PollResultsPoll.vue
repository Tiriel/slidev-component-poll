<script lang="ts" setup>
import { computed, inject, isVNode, ref } from "vue";

import { answersContext, idContext } from "../constants";
import { pollState } from "../services";

import PollResultPoll from "./PollResultPoll.vue";

const props = defineProps<{
  controlled?: boolean;
  correctAnswer?: string | number | number[];
  multiple?: boolean;
}>();

const id = inject(idContext, ref(""));

const context = inject(answersContext);
const renderAnswers = computed(() => {
  if (context?.answers) {
    return context.answers.value;
  }
  return [];
});

// Get answers in shuffled display order with their original indices
const shuffledAnswers = computed(() => {
  const order = context?.shuffleOrder.value ?? [];
  return order.map((originalIndex) => ({
    answer: renderAnswers.value[originalIndex],
    originalIndex,
  }));
});

const poll = computed(() => pollState[id.value]);

// Compute counts for each original index
const countsByIndex = computed<Record<number, number>>(() => {
  if (!poll.value) return {};

  const result: Record<number, number> = {};
  renderAnswers.value?.forEach((_: unknown, i: number) => {
    result[i] = Object.values(poll.value.results).reduce(
      (acc: number, res) =>
        acc +
        Number(
          res instanceof Array ? res.indexOf(i) > -1 : res === i
        ),
      0
    );
  });
  return result;
});

const total = computed<number>(() => {
  if (props.multiple) return Object.keys(poll.value?.results ?? {}).length;
  return Object.values(countsByIndex.value).reduce((a, b) => a + b, 0);
});

const percentagesByIndex = computed<Record<number, number>>(() => {
  const result: Record<number, number> = {};
  for (const [index, count] of Object.entries(countsByIndex.value)) {
    result[Number(index)] = total.value === 0 ? 0 : (count / total.value) * 100;
  }
  return result;
});

const max = computed(() => Math.max(...Object.values(countsByIndex.value), 0));
</script>

<template>
  <ul v-if="poll" class="poll-results">
    <PollResultPoll
      v-for="{ answer, originalIndex } in shuffledAnswers"
      :key="originalIndex"
      :controlled="controlled"
      :count="countsByIndex[originalIndex]"
      :correctAnswer="correctAnswer"
      :index="originalIndex"
      :leading="countsByIndex[originalIndex] === max"
      :percentage="percentagesByIndex[originalIndex]"
    >
      <component v-if="isVNode(answer)" :is="answer" />
      <div v-else>{{ answer }}</div>
    </PollResultPoll>
  </ul>
</template>
