import { server } from "./mocks/server.node.ts";

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("act(...)")) return;
  originalError.apply(console, args);
};

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  jest
    .spyOn(globalThis, "requestAnimationFrame")
    .mockImplementation((cb) => setTimeout(cb, 0));
});

afterAll(() => {
  jest.restoreAllMocks();
  server.close();
});
