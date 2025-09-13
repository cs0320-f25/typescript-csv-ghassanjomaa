import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

//mine below

test("Bob's age should be a number", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  const bobRow = results[2] // ["Bob", "thirty"]
  const age = bobRow[1]
  expect(isNaN(Number(age))).toBe(false)
})

// Same Number of Columns
test("All rows should have the same number of columns", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  const colCounts = results.map(r => r.length)
  const allEqual = colCounts.every(c => c === colCounts[0])
  expect(allEqual).toBe(true)
})

// First row should be headers
test("First row should contain headers", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(results[0]).toContain("name")
  expect(results[0]).toContain("age")
})

//emptycell checks
test("Shouldn't have empty cells", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  for (const row of results) {
    for (const cell of row) {
      expect(cell.trim()).not.toBe("")
    }
  }
})

// Schema 
const PersonRowSchema = z
  .tuple([z.string(), z.coerce.number()])
  .transform((tup) => ({ name: tup[0], age: tup[1] }));


test("parseCSV works with schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema);
  expect(results[1]).toEqual({ name: "Alice", age: 23 });
  expect(results[2]).toEqual({ name: "Bob", age: NaN }); // "thirty" -> NaN
  expect(results[3]).toEqual({ name: "Charlie", age: 25 });
});


