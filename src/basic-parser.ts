import * as fs from "fs";
import * as readline from "readline";
import { ZodType } from "zod";

/**
* This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
* function for others to use. Most modern editors will show the comment when
* mousing over this function name. Try it in run-parser.ts!
*
* File I/O in TypeScript is "asynchronous", meaning that we can't just
* read the file and return its contents. You'll learn more about this
* in class. For now, just leave the "async" and "await" where they are.
* You shouldn't need to alter them.
*
* @param path The path to the file being loaded.
* @returns a "promise" to produce a 2-d array of cell values
*/

// Regex options for CSV parsing
const regex1 = /[^,]+/g;
const regex2 = /"([^"]*)"|[^,]+/g;
const regex3 = /("([^"]*(?:""[^"]*)*)"|[^,]*)(,|$)/g;
const regex4 = /(?:^|,)(?:"((?:[^"]|"")*)"|([^",]*))/g;

export const regexes = { regex1, regex2, regex3, regex4 };

// Structured error type
export class CSVError extends Error {
  rowIndex: number;
  issues: unknown;
  constructor(message: string, rowIndex: number, issues: unknown) {
    super(message);
    this.rowIndex = rowIndex;
    this.issues = issues;
  }
}

export interface ParseCSVOptions {
  schema?: ZodType<any>;
  hasHeader?: boolean;
  regexChoice?: keyof typeof regexes;
}

/**
 * Main parser function
 */
export async function parseCSV<T>(
  path: string,
  options: ParseCSVOptions = {}
): Promise<{ header?: string[]; data: T[] | string[][] }> {
  const { schema, hasHeader = true, regexChoice = "regex3" } = options;
  const regex = regexes[regexChoice];

  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const result: string[][] = [];
  for await (const line of rl) {
    const values: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      // Prevent infinite loop when regex matches empty strings
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    
      const value = match[1] || match[2] || match[0];
      values.push(value.replace(/^"|"$/g, "").replace(/""/g, '"').trim());
    }    
    
    while (values.length > 0 && values[values.length - 1] === "") {
      values.pop();
    }

    if (values.length > 0) {
      result.push(values);
    }
  }

  let header: string[] | undefined;
  let rows = result;

  if (hasHeader && result.length > 0) {
    header = result[0];
    rows = result.slice(1);
  }

  if (!schema) {
    return { header, data: rows };
  }

  const parsed: T[] = [];
  for (let i = 0; i < rows.length; i++) {
    const outcome = schema.safeParse(rows[i]);
    if (!outcome.success) {
      throw new CSVError(
        `CSV row validation failed at row ${i + 1}`,
        i + 1,
        outcome.error.issues
      );
    }
    parsed.push(outcome.data);
  }

  return { header, data: parsed };
}

/**
 * Generator parser version
 */
export async function* parseCSVGenerator<T>(
  path: string,
  options: ParseCSVOptions = {}
): AsyncGenerator<T | string[]> {
  const { schema, hasHeader = true, regexChoice = "regex3" } = options;
  const regex = regexes[regexChoice];

  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isFirstRow = true;
  for await (const line of rl) {
    const values: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const value = match[1] || match[2] || match[0];
      values.push(value.replace(/^"|"$/g, "").replace(/""/g, '"').trim());
    }

    while (values.length > 0 && values[values.length - 1] === "") {
      values.pop();
    }

    if (hasHeader && isFirstRow) {
      isFirstRow = false;
      continue; // skip header row
    }

    if (!schema) {
      yield values;
    } else {
      const outcome = schema.safeParse(values);
      if (!outcome.success) {
        throw new CSVError(
          `CSV row validation failed in generator`,
          -1,
          outcome.error.issues
        );
      }
      yield outcome.data;
    }
  }
}