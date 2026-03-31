import { getMessageThread, getMessages } from "../index";
import { MOCK_MESSAGE_THREADS, MOCK_MESSAGES } from "@/mocks/data";

describe("getMessages", () => {
  it("returns the correct number of messages", async () => {
    const result = await getMessages();
    expect(result).toHaveLength(MOCK_MESSAGES.length);
  });

  it("each item has required fields", async () => {
    const result = await getMessages();
    for (const item of result) {
      expect(item).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        preview: expect.any(String),
        date: expect.any(String),
        iconColor: expect.any(String),
        iconKey: expect.any(String),
      });
    }
  });

  it("first item matches MOCK_MESSAGES[0]", async () => {
    const result = await getMessages();
    expect(result[0]).toMatchObject({ id: MOCK_MESSAGES[0].id, title: MOCK_MESSAGES[0].title });
  });
});

describe("getMessageThread", () => {
  it("returns the thread for a valid id", async () => {
    const result = await getMessageThread("1");
    expect(result).toMatchObject({
      id: "1",
      title: MOCK_MESSAGE_THREADS[0].title,
    });
  });

  it("returned thread has a messages array", async () => {
    const result = await getMessageThread("1");
    expect(Array.isArray(result.messages)).toBe(true);
    expect(result.messages.length).toBeGreaterThan(0);
  });

  it("each thread message has required fields", async () => {
    const result = await getMessageThread("1");
    for (const msg of result.messages) {
      expect(msg).toMatchObject({
        id: expect.any(String),
        text: expect.any(String),
        type: expect.stringMatching(/^(received|sent)$/),
        date: expect.any(String),
      });
    }
  });

  it("rejects with an error for an unknown id", async () => {
    await expect(getMessageThread("unknown-999")).rejects.toThrow();
  });
});
