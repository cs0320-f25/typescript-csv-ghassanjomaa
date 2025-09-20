import { regexes } from "../../src/basic-parser";

// Grab the regexes
const { regex1, regex2, regex3, regex4 } = regexes;

// Helper to run a regex against a line and extract values
function runRegex(regex: RegExp, line: string): string[] {
  const values: string[] = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index === regex.lastIndex) regex.lastIndex++; // prevent infinite loop
    values.push(match[1] || match[2] || match[0]);
  }
  return values;
}

describe("Regex comparison tests", () => {
  const line = `"Alice, Smith",23,"New York, NY"`;

  // --- Pairwise comparisons (6 total) ---
  test("regex1 vs regex2", () => {
    expect(runRegex(regex1, line)).not.toEqual(runRegex(regex2, line));
  });

  test("regex1 vs regex3", () => {
    expect(runRegex(regex1, line)).not.toEqual(runRegex(regex3, line));
  });

  test("regex1 vs regex4", () => {
    expect(runRegex(regex1, line)).not.toEqual(runRegex(regex4, line));
  });

  test("regex2 vs regex3", () => {
    expect(runRegex(regex2, line)).not.toEqual(runRegex(regex3, line));
  });

  test("regex2 vs regex4", () => {
    expect(runRegex(regex2, line)).not.toEqual(runRegex(regex4, line));
  });

  test("regex3 vs regex4", () => {
    expect(runRegex(regex3, line)).not.toEqual(runRegex(regex4, line));
  });
});

describe("Regex flaw tests", () => {
  test("regex1 fails on quoted commas", () => {
    const line = `"Alice, Smith",23`;
    const result = runRegex(regex1, line);
    // It splits incorrectly because regex1 ignores quotes
    expect(result).toEqual(['"Alice', ' Smith"', '23']);
  });

  test("regex2 fails on escaped quotes", () => {
    const line = `"Bob ""The Guy""",30`;
    const result = runRegex(regex2, line);
    // Should parse as Bob "The Guy", but regex2 breaks it
    expect(result).not.toEqual(['Bob "The Guy"', '30']);
  });

  test("regex3 leaves trailing empty cells", () => {
    const line = "Alice,23,";
    const result = runRegex(regex3, line);
    // It incorrectly captures the trailing comma
    expect(result[result.length - 1]).toBe("");
  });

  test("regex4 struggles with empty fields", () => {
    const line = "Alice,,23";
    const result = runRegex(regex4, line);
    // It should keep an empty string for the middle field
    expect(result).not.toEqual(["Alice", "", "23"]);
  });
});

describe("LLM regex tests", () => {
  // Slightly different variant from regex3
  const regexLLM = /("([^"]*(?:""[^"]*)*)"|[^,]*)(?:,|$)/g;

  test("LLM regex handles quoted commas", () => {
    const line = `"Alice, Smith",23`;
    const result = runRegex(regexLLM, line);
    expect(result).toEqual(["Alice, Smith", "23"]);
  });

  test("LLM regex handles escaped quotes", () => {
    const line = `"Bob ""The Guy""",30`;
    const result = runRegex(regexLLM, line);
    expect(result).toEqual(['Bob ""The Guy""', "30"]);
  });
});