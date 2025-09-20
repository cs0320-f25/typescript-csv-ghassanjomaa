import { parseCSV, CSVError } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results.header).toEqual(["name", "age"]);
  expect(results.data).toHaveLength(5);
  expect(results.data[0]).toEqual(["Alice", "23"]);
  expect(results.data[1]).toEqual(["Bob", "thirty"]);
  expect(results.data[2]).toEqual(["Charlie", "25"]);
  expect(results.data[3]).toEqual(["Nim", "22"]);
  expect(results.data[4]).toEqual(["Eve"]); // Flaw here too, missing column
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results.data) {
    expect(Array.isArray(row)).toBe(true);
  }
});

//mine below

test("Bob's age should be a number", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  const bobRow = results.data[2] as string[]; // ["Bob", "thirty"]
  const age = bobRow[1]
  expect(isNaN(Number(age))).toBe(true) // flaw here as text instead of number
})

// Same Number of Columns
test("All rows do not have same number of columns", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  const rows = results.data as string[][];
  const colCounts = rows.map((r) => r.length);
  const allEqual = colCounts.every((c) => c === colCounts[0]);
  expect(allEqual).toBe(false); // Flaw here, had to make false since Eve is missing value
});

// First row should be headers
test("First row should contain headers", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  expect(results.header).toContain("name");
  expect(results.header).toContain("age");
});

//emptycell checks
test("Shouldn't have empty cells", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  const rows = results.data as string[][];
  for (const row of rows) {
    for (const cell of row) {
      expect(cell.trim()).not.toBe("");
    }
  }
});

// Schema 
const PersonRowSchema = z
  .tuple([z.string(), z.coerce.number()])
  .transform((tup) => ({ name: tup[0], age: tup[1] }));

  test("parseCSV fails schema validation when encountering bad rows", async () => {
    await expect(
      parseCSV(PEOPLE_CSV_PATH, { schema: PersonRowSchema })
    ).rejects.toThrow(CSVError); // expected: Bob’s "thirty" and Eve’s missing age
  });

  // Extra schema tests for User Story 5

// branded age schema
const Age = z.number().brand<"Age">();
const BrandedPersonSchema = z.object({
  name: z.string(),
  age: Age,
});

test("parseCSV with branded schema fails on bad age", async () => {
  await expect(
    parseCSV(PEOPLE_CSV_PATH, {
      schema: BrandedPersonSchema.transform((row) => ({
        name: row.name,
        age: row.age,
      })),
      hasHeader: true,
    })
  ).rejects.toThrow(CSVError);
});

// refined schema: age must be >= 0
const RefinedPersonSchema = z
  .tuple([z.string(), z.coerce.number().refine((n) => n >= 0, "Age must be non-negative")])
  .transform((tup) => ({ name: tup[0], age: tup[1] }));

test("parseCSV with refined schema fails when age < 0", async () => {
  const badCSVPath = path.join(__dirname, "../data/bad-age.csv");
  // you can create a quick test CSV: name,age\nBob,-5
  await expect(
    parseCSV(badCSVPath, { schema: RefinedPersonSchema, hasHeader: true })
  ).rejects.toThrow(CSVError);
});
  


