// pretty-printer.ts
import {
  Node,
  NodeType,
  Program,
  Statement,
  ExpressionStatement,
  VariableDeclaration,
  VariableDeclarator,
  Identifier,
  IfStatement,
  BlockStatement,
  FunctionDeclaration,
  ClassDeclaration,
  ClassBody,
  ClassElement,
  FunctionExpression,
  ReturnStatement,
  Expression,
  Literal,
  BinaryExpression,
  UnaryExpression,
  CallExpression,
  MemberExpression,
  ArrayExpression,
  ObjectExpression,
  Property,
  ArrowFunctionExpression,
  ThisExpression,
  SpreadElement,
  Comment,
  LineBreakFlags,
  CommentTypeFlags,
  CommentPlacementFlags,
} from './ast';
import { collectComments } from './comments';

// Comment Formatting Options
enum CommentFormat {
  // prettier-like format for each comment type
  Multiline = 'multiline',
  SingleLine = 'singleline',
  Html = 'html',
  JsDoc = 'jsdoc',
}

// Default options for pretty printing
const defaultOptions = {
  printWidth: 80, // Default line length
  tabWidth: 2, // Default tab size
  useTabs: false, // Default to spaces for indentation
  lineBreak: false, // Default to no line breaks
  commentPlacement: 'after', // Default comment placement after token
  commentFormat: CommentFormat.Multiline, // Default comment format
  commentTypes: CommentTypeFlags.All, // Support all comment types by default
  commentPlacementFlag: CommentPlacementFlags.After, // Support all comment types by default
};

// Function to pretty print a Node with comments
function prettyPrint(
  node: Node,
  options: {
    printWidth?: number;
    tabWidth?: number;
    useTabs?: boolean;
    lineBreak?: boolean;
    commentPlacement?: string;
    commentFormat?: CommentFormat;
  } = defaultOptions
): string {
  // Handle different node types
  switch (node.type) {
    case NodeType.Program:
      return printProgram(node as Program, options);
    case NodeType.ExpressionStatement:
      return printExpressionStatement(node as ExpressionStatement, options);
    case NodeType.VariableDeclaration:
      return printVariableDeclaration(node as VariableDeclaration, options);
    case NodeType.VariableDeclarator:
      return printVariableDeclarator(node as VariableDeclarator, options);
    case NodeType.Identifier:
      return printIdentifier(node as Identifier, options);
    case NodeType.IfStatement:
      return printIfStatement(node as IfStatement, options);
    case NodeType.BlockStatement:
      return printBlockStatement(node as BlockStatement, options);
    case NodeType.FunctionDeclaration:
      return printFunctionDeclaration(node as FunctionDeclaration, options);
    case NodeType.ClassDeclaration:
      return printClassDeclaration(node as ClassDeclaration, options);
    case NodeType.ClassBody:
      return printClassBody(node as ClassBody, options);
    case NodeType.ClassElement:
      return printClassElement(node as ClassElement, options);
    case NodeType.FunctionExpression:
      return printFunctionExpression(node as FunctionExpression, options);
    case NodeType.ReturnStatement:
      return printReturnStatement(node as ReturnStatement, options);
    case NodeType.Literal:
      return printLiteral(node as Literal, options);
    case NodeType.BinaryExpression:
      return printBinaryExpression(node as BinaryExpression, options);
    case NodeType.UnaryExpression:
      return printUnaryExpression(node as UnaryExpression, options);
    case NodeType.CallExpression:
      return printCallExpression(node as CallExpression, options);
    case NodeType.MemberExpression:
      return printMemberExpression(node as MemberExpression, options);
    case NodeType.ArrayExpression:
      return printArrayExpression(node as ArrayExpression, options);
    case NodeType.ObjectExpression:
      return printObjectExpression(node as ObjectExpression, options);
    case NodeType.Property:
      return printProperty(node as Property, options);
    case NodeType.ArrowFunctionExpression:
      return printArrowFunctionExpression(node as ArrowFunctionExpression, options);
    case NodeType.ThisExpression:
      return printThisExpression(node as ThisExpression, options);
    case NodeType.SpreadElement:
      return printSpreadElement(node as SpreadElement, options);
    case NodeType.ConditionalExpression:
      return printConditionalExpression(node as ConditionalExpression, options);
    case 'Comment': // Handle comment nodes
      return printComment(node as Comment, options);
    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

// Helper functions for printing different node types
function printProgram(program: Program, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = '';
  program.body.forEach((node, index) => {
    if (node.type === 'Comment') {
      output += printComment(node as Comment, options);
    } else {
      output += printStatement(node as Statement, options, index === program.body.length - 1);
    }
  });
  return output.trim();
}

function printStatement(statement: Statement, options: any, isLast: boolean): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = '';
  switch (statement.type) {
    case NodeType.ExpressionStatement:
      output += printExpressionStatement(statement as ExpressionStatement, options);
      break;
    case NodeType.VariableDeclaration:
      output += printVariableDeclaration(statement as VariableDeclaration, options);
      break;
    case NodeType.IfStatement:
      output += printIfStatement(statement as IfStatement, options);
      break;
    case NodeType.BlockStatement:
      output += printBlockStatement(statement as BlockStatement, options);
      break;
    case NodeType.FunctionDeclaration:
      output += printFunctionDeclaration(statement as FunctionDeclaration, options);
      break;
    case NodeType.ClassDeclaration:
      output += printClassDeclaration(statement as ClassDeclaration, options);
      break;
    case NodeType.ReturnStatement:
      output += printReturnStatement(statement as ReturnStatement, options);
      break;
    default:
      throw new Error(`Unsupported statement type: ${statement.type}`);
  }
  if (!isLast) {
    output += '\n';
  }
  return output;
}

function printExpressionStatement(expressionStatement: ExpressionStatement, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}${prettyPrint(expressionStatement.expression, options)}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ';';
  }
  return output;
}

function printVariableDeclaration(variableDeclaration: VariableDeclaration, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}${variableDeclaration.kind} ${variableDeclaration.declarations
    .map((declarator) => printVariableDeclarator(declarator, options))
    .join(', ')}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ';';
  }
  return output;
}

function printVariableDeclarator(variableDeclarator: VariableDeclarator, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${prettyPrint(variableDeclarator.id, options)}`;
  if (variableDeclarator.init) {
    output += ` = ${prettyPrint(variableDeclarator.init, options)}`;
  }
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ';';
  }
  return output;
}

function printIdentifier(identifier: Identifier, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  return `${indentation}${identifier.name}`;
}

function printIfStatement(ifStatement: IfStatement, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}if (${prettyPrint(ifStatement.test, options)})`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${printStatement(
    ifStatement.consequent,
    options
  )}${ifStatement.alternate ? ` else ${printStatement(ifStatement.alternate, options)}` : ''}`;
  return output;
}

function printBlockStatement(blockStatement: BlockStatement, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}{`;
  if (lineBreak) {
    output += '\n';
  }
  blockStatement.body.forEach((node, index) => {
    if (node.type === 'Comment') {
      output += printComment(node as Comment, options);
    } else {
      output += printStatement(node as Statement, options, index === blockStatement.body.length - 1);
    }
  });
  if (lineBreak) {
    output += '\n';
  }
  output += `${indentation}}`;
  return output;
}

function printFunctionDeclaration(functionDeclaration: FunctionDeclaration, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}function ${prettyPrint(
    functionDeclaration.id,
    options
  )}(${functionDeclaration.params
    .map((param) => prettyPrint(param, options))
    .join(', ')})`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${printBlockStatement(functionDeclaration.body, options)}`;
  return output;
}

function printClassDeclaration(classDeclaration: ClassDeclaration, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  const classBody = classDeclaration.body;
  const bodyText = classBody.body.map((element) => {
    if (element.type === 'Comment') {
      return printComment(element as Comment, options);
    } else {
      const comment = collectComments(
        sourceCode,
        element.start,
        element.end,
        { commentTypes: 'all' }
      ).map((comment) => {
        switch (commentFormat) {
          case CommentFormat.Multiline:
            return `/* ${sourceCode.substring(comment.start, comment.end)} */`;
          case CommentFormat.SingleLine:
            return `// ${sourceCode.substring(comment.start, comment.end)}`;
          case CommentFormat.Html:
            return `<!-- ${sourceCode.substring(comment.start, comment.end)} -->`;
          case CommentFormat.JsDoc:
            return `/** ${sourceCode.substring(comment.start, comment.end)} */`;
        }
      }).join('\n');
      return `${indentation}${comment}\n${indentation}${prettyPrint(element, options)}`;
    }
  }).join('\n');

  return `${indentation}class ${prettyPrint(
    classDeclaration.id,
    options
  )} {${bodyText}\n${indentation}}`;
}

function printClassElement(classElement: ClassElement, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  // Handle special cases of class elements
  if (classElement.key.type === NodeType.Identifier && classElement.key.name === 'constructor') {
    // Handle constructor
    return `${indentation}constructor(${classElement.value.params
      .map((param) => prettyPrint(param, options))
      .join(', ')}) ${printBlockStatement(classElement.value.body, options)}`;
  } else if (classElement.key.type === NodeType.Identifier && classElement.key.name === 'static') {
    // Handle static methods
    return `${indentation}static ${prettyPrint(
      classElement.key,
      options
    )}(${classElement.value.params
      .map((param) => prettyPrint(param, options))
      .join(', ')}) ${printBlockStatement(classElement.value.body, options)}`;
  } else {
    // Handle regular methods
    return `${indentation}${classElement.static ? 'static ' : ''}${prettyPrint(
      classElement.key,
      options
    )}(${classElement.value.params
      .map((param) => prettyPrint(param, options))
      .join(', ')}) ${printBlockStatement(classElement.value.body, options)}`;
  }
}

function printFunctionExpression(functionExpression: FunctionExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  return `${indentation}(${functionExpression.params
    .map((param) => prettyPrint(param, options))
    .join(', ')}) ${printBlockStatement(functionExpression.body, options)}`;
}

function printReturnStatement(returnStatement: ReturnStatement, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}return`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${returnStatement.argument ? ` ${prettyPrint(returnStatement.argument, options)}` : ''};`;
  return output;
}

function printLiteral(literal: Literal, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  return `${indentation}${literal.raw}`;
}

function printBinaryExpression(binaryExpression: BinaryExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${prettyPrint(binaryExpression.left, options)}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${binaryExpression.operator} ${prettyPrint(
    binaryExpression.right,
    options
  )}`;
  if (binaryExpression.lineBreak) {
    if (binaryExpression.lineBreak & LineBreakFlags.Before) {
      output += '\n';
    }
    if (binaryExpression.lineBreak & LineBreakFlags.After) {
      output += '\n';
    }
  }
  return output;
}

function printUnaryExpression(unaryExpression: UnaryExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${unaryExpression.operator}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${prettyPrint(unaryExpression.argument, options)}`;
  return output;
}

function printCallExpression(callExpression: CallExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${prettyPrint(callExpression.callee, options)}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `(${callExpression.arguments
    .map((argument) => prettyPrint(argument, options))
    .join(', ')})`;
  return output;
}

function printMemberExpression(memberExpression: MemberExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${prettyPrint(memberExpression.object, options)}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${memberExpression.computed ? '[' : '.'}${prettyPrint(
    memberExpression.property,
    options
  )}${memberExpression.computed ? ']' : ''}`;
  return output;
}

function printArrayExpression(arrayExpression: ArrayExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  const elements = arrayExpression.elements.filter(
    (element) => element !== null
  ) as Expression[]; // Filter out null elements
  return `[${elements
    .map((element) => prettyPrint(element, options))
    .join(', ')}]`;
}

function printObjectExpression(objectExpression: ObjectExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  return `{${objectExpression.properties
    .map((property) => prettyPrint(property, options))
    .join(', ')}`;
}

function printProperty(property: Property, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${prettyPrint(property.key, options)}`;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `: ${prettyPrint(property.value, options)}`;
  return output;
}

function printArrowFunctionExpression(arrowFunctionExpression: ArrowFunctionExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${indentation}(${arrowFunctionExpression.params
    .map((param) => prettyPrint(param, options))
    .join(', ')}) => `;
  if (commentPlacementFlag & CommentPlacementFlags.After) {
    output += ' ';
  }
  output += `${arrowFunctionExpression.body.type === NodeType.BlockStatement
    ? printBlockStatement(arrowFunctionExpression.body as BlockStatement, options)
    : prettyPrint(arrowFunctionExpression.body as Expression, options)}`;
  return output;
}

function printThisExpression(thisExpression: ThisExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  return `${indentation}this`;
}

function printSpreadElement(spreadElement: SpreadElement, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  return `${indentation}...${prettyPrint(spreadElement.argument, options)}`;
}

function printConditionalExpression(conditionalExpression: ConditionalExpression, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  let output = `${prettyPrint(conditionalExpression.test, options)} ? ${prettyPrint(
    conditionalExpression.consequent,
    options
  )} : ${prettyPrint(conditionalExpression.alternate, options)}`;
  if (conditionalExpression.lineBreak) {
    if (conditionalExpression.lineBreak & LineBreakFlags.Before) {
      output += '\n';
    }
    if (conditionalExpression.lineBreak & LineBreakFlags.After) {
      output += '\n';
    }
  }
  return output;
}

function printComment(comment: Comment, options: any): string {
  const { printWidth, tabWidth, useTabs, lineBreak, commentPlacement, commentFormat, commentTypes, commentPlacementFlag } = options;
  const indentation = useTabs ? '\t' : ' '.repeat(tabWidth);
  switch (commentFormat) {
    case CommentFormat.Multiline:
      return `${indentation}/* ${sourceCode.substring(comment.start, comment.end)} */\n`;
    case CommentFormat.SingleLine:
      return `${indentation}// ${sourceCode.substring(comment.start, comment.end)}\n`;
    case CommentFormat.Html:
      return `${indentation}<!-- ${sourceCode.substring(comment.start, comment.end)} -->\n`;
    case CommentFormat.JsDoc:
      return `${indentation}/** ${sourceCode.substring(comment.start, comment.end)} */\n`;
  }
}
