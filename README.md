# Sprint 1: TypeScript CSV

### Task B: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
- Functionality: The parser does not catch when a value should be numbers, like ("Bob, thirty") is allowed.
- Functionality: The parser does not care if rows don't have the same # of columns.
- Extensibility: The parser also just gives back raw arrays, it doesn't help tell headers apart from actual data.
- Functionality: The parser allows empty cells without errors.

- #### Step 2: Use an LLM to help expand your perspective.
- Functionality: The parser doesn’t handle CSV files with extra whitespace or different line endings gracefully.  
- Functionality: The parser doesn’t support skipping comment lines (e.g., starting with `#`).  
- Extensibility: The parser provides no clear error handling (caller can’t tell why parsing failed).  
- Extensibility: The parser always returns `string[][]` and can’t map directly into structured objects. 

- #### Step 3: propose enhancements in your project README file:

  Functionality:
  1. As a developer, I want the parser to check the numeric fields so that invalid data, like "thirty" in an age column is not allowed.
  2. As a developer, I want the parser to ensure all rows have the same number of columns, so that my following code does not break when trying to read the data.
  (Source: Me)

  Extensibility:
  3. As a developer, I want the parser to recognize and skip header rows so I don’t have to manually handle them every time.
  (Source: Both, I thought of it and the LLM expanded/emphasized)
  4. As a developer, I want the parser to provide structured error feedback instead of silent failures so that I can debug bad CSV files quickly.
  (Source: LLM's suggestions that I liked)

    Notes & Reflection:
    So, my initial ideas came from issues I actually saw break when running tests, like the number-value checking, consistent columns, headers, and empty cells. The LLM added new perspectives, like whitespace handling and structured error reporting. So, we both considered error handling, but it had errors I did not consider. What resonated most was structured error messages, since they make debugging easier for devs. I did not inclide other things they considered, like quoted commas (Doe, John) since I never tested in my setup.

### Design Choices
- Stuck close with starter and only added schema support.

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project: 3 hours
#### Link to GitHub Repo: https://github.com/cs0320-f25/typescript-csv-ghassanjomaa
