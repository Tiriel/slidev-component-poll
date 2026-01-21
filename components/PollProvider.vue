<script lang="ts" setup>
import { provide, ref } from "vue";

import { useId } from "../composables/useId";
import { Answers, answersContext, idContext } from "../constants";
import { getShuffledIndices } from "../services";
import { configs } from "../services/slidev-compat";

const props = defineProps<{
  id?: string;
}>();

let id;
if (props.id) {
  id = ref(props.id);
} else if (!id) {
  id = useId();
}

const answers = ref<Answers>([]);
const shuffleOrder = ref<number[]>([]);

function setAnswers(newAnswers: Answers) {
  answers.value = newAnswers;
  // Compute shuffle order when answers are set
  if (configs.pollSettings?.randomize && newAnswers.length > 0) {
    shuffleOrder.value = getShuffledIndices(newAnswers.length, id.value);
  } else {
    // Default order (0, 1, 2, ...)
    shuffleOrder.value = Array.from({ length: newAnswers.length }, (_, i) => i);
  }
}

function setShuffleOrder(order: number[]) {
  shuffleOrder.value = order;
}

provide(idContext, id);
provide(answersContext, { answers, setAnswers, shuffleOrder, setShuffleOrder });
</script>

<template>
  <div>
    <slot v-if="id" />
  </div>
</template>
