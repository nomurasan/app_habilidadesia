import { describe, it, expect } from "vitest";
import { sanitizeInput } from "../server/middleware/security";

describe("Input Sanitization", () => {
  it("should strip script tags from string content", () => {
    const maliciousInput = "Hello <script>alert('xss')</script>World";
    const cleaned = sanitizeInput(maliciousInput);
    expect(cleaned).toBe("Hello World");
  });

  it("should strip html characters from nested object properties", () => {
    const complexInput = {
      title: "<h1>Important Title</h1>",
      tags: ["<p>news</p>", "<span>science</span>"],
      meta: {
        description: "<script>console.log('hi')</script>Awesome!"
      }
    };
    const cleaned = sanitizeInput(complexInput);
    expect(cleaned.title).toBe("Important Title");
    expect(cleaned.tags[0]).toBe("news");
    expect(cleaned.tags[1]).toBe("science");
    expect(cleaned.meta.description).toBe("Awesome!");
  });
});
