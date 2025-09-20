import { parseCSV } from "./basic-parser";

/*
  Example of how to run the parser outside of a test suite.
*/

const DATA_FILE = "./data/people.csv"; // update with your actual file name

async function main() {
  // Because the parseCSV function needs to "await" data, we need to do the same here.
  const results = await parseCSV(DATA_FILE)

  // Notice the difference between "of" and "in". One iterates over the entries, 
  // another iterates over the indexes only.
  if (results.header) {
    console.log("Header:", results.header);
  }

  for(const record of results.data as string[][]) {
    console.log("Row:", record);
  }
}

main();