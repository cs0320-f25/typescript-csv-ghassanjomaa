1. - #### Correctness
- A CSV parser is correct if it splits rows and columns according to the CSV reqs, like enforcing consistent column counts, getting rid of whitespace, and validating data types when a schema is provided. It should reject badly formed rows (like, missing values, extra columns, or invalid types like "thirty" in a number column) instead of silently allowing them.

2. - #### Random, On-Demand Generation 
- If I had a function that generated random CSVs, I could use it to stress test the parser by covering more edge cases automatically (like, random blank fields, random invalid numbers, and random extra columns). This would expand coverage beyond just the fixed people.csv file, since the random generator might produce cases I didn’t think of.

3. - #### Overall Experience, Bugs Encountered and Resolved
- This sprint was different from past assignments I've done because it focused on testing existing code instead of just writing new code and getting used to working with an LLM when applicable. It surprised me how quickly weak spots in the parser showed up once I wrote targeted tests (like Bob’s age not being numeric). I ran into issues with inconsistent rows and schema validation errors, but as expected. Writing tests and adding schema validation helped me see exactly where the parser fails, which made debugging pretty straightforward.