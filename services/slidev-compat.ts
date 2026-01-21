/**
 * Slidev API Compatibility Layer
 *
 * This module centralizes all Slidev imports to provide a single point of
 * maintenance for API changes across Slidev versions. It wraps internal
 * APIs that may change between versions.
 *
 * Supported Slidev versions: >=51.0.0
 */

// Re-export stable public APIs
export { configs, useNav, useSlideContext } from "@slidev/client";

// Import createSyncState - this is an internal API that may change
// We use the direct import path as there's no public export yet
import { createSyncState as _createSyncState } from "@slidev/client/state/syncState.ts";

// Re-export with same signature for future compatibility
export const createSyncState = _createSyncState;

// Type re-exports
export type { SlidevConfig } from "@slidev/types";
