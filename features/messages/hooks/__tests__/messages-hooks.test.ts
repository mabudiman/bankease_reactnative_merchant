import { renderHook, waitFor } from "@testing-library/react-native";
import { useMessageThread, useMessages } from "../index";
import { createWrapper } from "@/test-utils/createWrapper";
import { MOCK_MESSAGE_THREADS, MOCK_MESSAGES } from "@/mocks/data";

describe("useMessages", () => {
  it("starts in loading state", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useMessages(), { wrapper: Wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it("settles with the correct number of messages", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useMessages(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(MOCK_MESSAGES.length);
  });

  it("settles with data matching MOCK_MESSAGES", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useMessages(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]).toMatchObject({ id: MOCK_MESSAGES[0].id });
  });
});

describe("useMessageThread", () => {
  it("settles with the correct thread for id '1'", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useMessageThread("1"), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({
      id: "1",
      title: MOCK_MESSAGE_THREADS[0].title,
    });
  });

  it("returned thread messages array is non-empty", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useMessageThread("1"), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect((result.current.data?.messages ?? []).length).toBeGreaterThan(0);
  });

  it("is disabled when id is empty", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useMessageThread(""), { wrapper: Wrapper });
    expect(result.current.fetchStatus).toBe("idle");
  });
});
