## JavaScript/TypeScript Pretty Printer with Comment Handling: A Detailed Guide

This document provides a comprehensive guide to a JavaScript and TypeScript pretty printer that seamlessly integrates comment extraction and formatting. It offers flexibility and control over how comments are presented within the formatted code, mirroring the capabilities of Prettier. 

**Introduction**

The pretty printer is a tool that formats JavaScript and TypeScript code to improve readability and consistency. It uses a custom Abstract Syntax Tree (AST) to represent the code and leverages the functionality of a robust comment extractor to handle comments within the formatted output. 

**Key Features:**

* **Customizable Formatting:** Offers options for:
    - **Line Length (printWidth):**  Controls the maximum line length to prevent code from becoming excessively long.
    - **Tab Size (tabWidth):**  Specifies the width of a tab character for indentation.
    - **Indentation Type (useTabs):**  Chooses between using spaces or tabs for indentation.
    - **Line Breaks (lineBreak):**  Determines whether line breaks are added to the output to enhance readability.
    - **Comment Placement (commentPlacement):**  Controls whether comments are placed before or after the code they relate to.
    - **Comment Format (commentFormat):**  Specifies the format for different comment types, including multiline, single-line, HTML, and JSDoc comments. 
    - **Comment Types (commentTypes):**  Allows the user to specify which comment types to include in the output.
* **Comment Extraction:**  **Utilizes the `collectComments` function from the comment extraction library to accurately identify and extract comments from the code.**
* **Comment Formatting:**  Formats comments based on the chosen `commentFormat` option, mimicking the style of Prettier.
* **AST Handling:** Uses a custom AST structure (provided in previous responses) to represent the code. This AST is optimized for efficiency and flexibility.

**Options:**

The pretty printer offers a wide range of options to customize the formatting of your code:

| Option              | Description                                                                                 | Default Value |
|----------------------|-------------------------------------------------------------------------------------------|----------------|
| `printWidth`         | Maximum line length (code will be wrapped to fit within this limit)                         | 80            |
| `tabWidth`           | Width of a tab character for indentation                                                    | 2             |
| `useTabs`            | Use tabs for indentation (`true`) or spaces (`false`)                                     | `false`        |
| `lineBreak`          | Add line breaks after each statement (`true`) or not (`false`)                             | `false`        |
| `commentPlacement`  | Place comments *before* (`'before'`) or *after* (`'after'`) the code they relate to            | `"after"`     |
| `commentFormat`     | Specify the format for different comment types                                               | `"multiline"`  |
| `commentTypes`      | Control which comment types are included in the output                                  | `"all"`       |

**Comment Formatting Examples:**

Here's how the pretty printer formats comments based on the `commentFormat` option:

- **`commentFormat: CommentFormat.Multiline` (default):** 
```javascript
// Single-line comments are always single-line
// This is a single-line comment

/* This is a multiline comment 
   spanning multiple lines. 
   It contains a nested single-line comment: 
   // This is a nested comment 
*/

/** This is a JSDoc comment 
  * with a nested HTML comment: <!-- This is an HTML comment --> 
  */

<!-- This is an HTML comment /** This is a JSDoc comment */ --> 
```

- **`commentFormat: CommentFormat.SingleLine`:**
```javascript
// This is a single-line comment
// This is a multiline comment 
// spanning multiple lines. 
// It contains a nested single-line comment: 
// This is a nested comment 

// This is a JSDoc comment 
// with a nested HTML comment: <!-- This is an HTML comment --> 

// This is an HTML comment This is a JSDoc comment 
```

- **`commentFormat: CommentFormat.Html`:**
```javascript
// This is a single-line comment
<!-- This is a multiline comment 
   spanning multiple lines. 
   It contains a nested single-line comment: 
   This is a nested comment 
-->

<!-- This is a JSDoc comment 
  * with a nested HTML comment: <!-- This is an HTML comment --> 
  -->

<!-- This is an HTML comment This is a JSDoc comment --> 
```

- **`commentFormat: CommentFormat.JsDoc`:**
```javascript
// This is a single-line comment
/** This is a multiline comment 
  * spanning multiple lines. 
  * It contains a nested single-line comment: 
  * This is a nested comment 
  */

/** This is a JSDoc comment 
  * with a nested HTML comment: <!-- This is an HTML comment --> 
  */

/** This is an HTML comment This is a JSDoc comment */ 
```

**Comment Placement Examples:**

Here's how the pretty printer places comments based on the `commentPlacement` option:

- **`commentPlacement: 'after'` (default):** 
```javascript
const x = 10; // This is a comment after the variable declaration.

function myFunction(a, b) { // This is a comment after the function declaration.
  // This is a comment inside the function.
  return a + b; // This is a comment after the return statement.
} 
```

- **`commentPlacement: 'before'`:**
```javascript
// This is a comment before the variable declaration.
const x = 10; 

// This is a comment before the function declaration.
function myFunction(a, b) {
  // This is a comment inside the function.
  return a + b; // This is a comment after the return statement.
} 
```

**Using the Pretty Printer:**

```typescript
// ... (Assuming you have an AST created based on your JavaScript code) ...
// Import the necessary library
import { prettyPrint } from './pretty-printer';
import { collectComments } from './comments'; // Import the comment extraction function

// Set options
const options = {
  printWidth: 80, // Limit line length to 80 characters
  tabWidth: 2, // Use 2 spaces per tab
  useTabs: false, // Use spaces for indentation
  lineBreak: true, // Add line breaks after each statement
  commentPlacement: 'before', // Place comments before the code
  commentFormat: CommentFormat.SingleLine, // Use single-line comment format
  commentTypes: CommentTypeFlags.All // Support all comment types
};

// Pretty-print the AST
const formattedCode = prettyPrint(ast, options);
console.log(formattedCode);
```

**Example Output:**

```javascript
// This is a single-line comment at the beginning. 
// This is a multiline comment 
// spanning multiple lines.
// It contains a nested single-line comment: 
// This is a nested comment 
// and another nested multiline comment: 
// /* Nested multiline comment */
// This is a JSDoc comment with a nested single-line comment: 
// This is a nested comment 
// It spans multiple lines.
class MyClass {
  // This is a comment inside the class. 
  // This is another comment with semicolons.
  ;;;
  /* ++++ */
  ;;;
  method() {
    // This is a comment inside a method.
  }
  *generatorMethod() {
    // This is a comment inside the generator method.
    yield 1;
    // This is another comment inside the generator method.
    yield 2;
  }
  // This is another comment inside the class.
}
// This is a comment after a punctuator.
X =
/* arrow */
> y;
// This is a multiline comment 
// spanning multiple lines.
// It contains a nested single-line comment: 
// This is a nested comment 
// and another nested multiline comment: 
// /* Nested multiline comment */
// This is a single-line comment at the end.
```

**Important Notes:**

- **Comment Extractor:** The `collectComments` function is assumed to be imported from the separated library.
- **Thorough Testing:**  Always test the pretty printer with a wide range of code examples to ensure its correctness and to validate the formatting options.
- **AST Creation:** You will need to create the AST for your JavaScript or TypeScript code using a parser or manually.

With this comprehensive guide, you can utilize this powerful pretty printer to format your JavaScript and TypeScript code with flexibility and precision, while maintaining the clarity and readability of your code. 



