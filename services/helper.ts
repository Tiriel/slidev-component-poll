import type { Result } from "../types";

import { pollState } from "./state.ts";
import { deviceId } from "./user.ts";

/**
 * Simple seeded random number generator (mulberry32)
 * Returns a function that generates random numbers between 0 and 1
 */
function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Convert a string to a numeric seed
 */
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a shuffled array of indices based on a seed string
 * The shuffle is deterministic - same seed always produces same order
 */
export function getShuffledIndices(length: number, seed: string): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  const random = seededRandom(stringToSeed(seed));

  // Fisher-Yates shuffle with seeded random
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

export function indexMatchResult(
  index?: number,
  correctAnswer?: null | string | number | number[]
) {
  if (index === undefined || correctAnswer === undefined) {
    return false;
  }
  return correctAnswer instanceof Array
    ? correctAnswer.includes(index)
    : Number(correctAnswer) === index;
}

export function getDefaultValue(
  id: string,
  hasResult: boolean,
  multiple?: boolean
): null | Result {
  const answer = pollState[id]?.results?.[deviceId.value];
  if (hasResult) {
    if (
      (answer instanceof Array && multiple) ||
      (typeof answer === "number" && !multiple)
    ) {
      return answer;
    } else if (multiple && typeof answer === "number") {
      return [answer];
    } else if (!multiple && answer instanceof Array) {
      return answer[0];
    }
  }
  return multiple ? ([] as number[]) : null;
}

export function isEnabled(defaultValue: null | Result, index: number): boolean {
  return defaultValue instanceof Array ? defaultValue.includes(index) : defaultValue === index
}
