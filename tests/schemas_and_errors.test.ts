import { describe, it, expect } from "vitest";
import { quizFeedbackSchema } from "../server/validators/schemas";
import { translateFirebaseError } from "../src/utils/errors";

describe("Schemas & Errors Validation", () => {
  it("should validate quiz feedback schema with correct inputs", () => {
    const validPayload = {
      scenario: "This is a dummy test scenario which must be longer than 5 chars",
      correctAnswer: "A",
      selectedAnswer: "B",
      level: "Hard"
    };
    const parsed = quizFeedbackSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it("should fail quiz feedback schema with invalid inputs", () => {
    const invalidPayload = {
      scenario: "short",
      correctAnswer: "",
      selectedAnswer: "B",
      level: ""
    };
    const parsed = quizFeedbackSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });

  it("should map permission-denied Firebase errors to AppError", () => {
    const mockError = { code: "permission-denied", message: "Failed to read database" };
    const mapped = translateFirebaseError(mockError);
    expect(mapped.code).toBe("PERMISSION_DENIED");
    expect(mapped.userMessage).toContain("permissão");
  });
});
