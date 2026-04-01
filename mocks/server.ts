/**
 * MSW Server Setup for React Native (runtime / dev builds)
 * Uses runtimeHandlers which passthrough profile requests to the real API.
 * Polyfills must be imported before MSW.
 */
import './polyfills';
import { setupServer } from 'msw/native';
import { runtimeHandlers } from './handlers';

export const server = setupServer(...runtimeHandlers);

