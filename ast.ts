enum NodeType {
  Program = 'Program',
  ExpressionStatement = 'ExpressionStatement',
  VariableDeclaration = 'VariableDeclaration',
  VariableDeclarator = 'VariableDeclarator',
  Identifier = 'Identifier',
  IfStatement = 'IfStatement',
  BlockStatement = 'BlockStatement',
  FunctionDeclaration = 'FunctionDeclaration',
  ClassDeclaration = 'ClassDeclaration',
  ClassBody = 'ClassBody',
  ClassElement = 'MethodDefinition',
  FunctionExpression = 'FunctionExpression',
  ReturnStatement = 'ReturnStatement',
  Literal = 'Literal',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  CallExpression = 'CallExpression',
  MemberExpression = 'MemberExpression',
  ArrayExpression = 'ArrayExpression',
  ObjectExpression = 'ObjectExpression',
  Property = 'Property',
  ArrowFunctionExpression = 'ArrowFunctionExpression',
  ThisExpression = 'ThisExpression',
  SpreadElement = 'SpreadElement',
  ConditionalExpression = 'ConditionalExpression', // Add ConditionalExpression
}

// Bitmask for line break options
const LineBreakFlags = {
  None: 0,
  Before: 1 << 0,
  After: 1 << 1,
  Both: 1 << 2,
};

// Bitmask for comment types
const CommentTypeFlags = {
  None: 0,
  SingleLine: 1 << 0,
  Multiline: 1 << 1,
  Html: 1 << 2,
  JsDoc: 1 << 3,
  All: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3, // Support all comment types by default
};

// Bitmask for comment placement
const CommentPlacementFlags = {
  None: 0,
  Before: 1 << 0,
  After: 1 << 1,
};

interface Node {
  type: NodeType;
  value?: string | number | boolean; // Use a single "value" for string, number, boolean
  start: number; // Starting position in source code
  end: number; // Ending position in source code
  children?: Node[];
  flag?: string; // Flag for comment placement (e.g., 'before', 'after')
  lineBreak?: number; // Line break options (bitmask)
}

interface Program extends Node {
  type: NodeType.Program;
  body: (Statement | Comment)[]; // Array of Statement or Comment
}

interface Statement extends Node {
  type: NodeType.ExpressionStatement | NodeType.VariableDeclaration | NodeType.IfStatement | NodeType.BlockStatement | NodeType.FunctionDeclaration | NodeType.ClassDeclaration | NodeType.ReturnStatement;
}

interface ExpressionStatement extends Statement {
  type: NodeType.ExpressionStatement;
  expression: Expression;
}

interface VariableDeclaration extends Statement {
  type: NodeType.VariableDeclaration;
  declarations: VariableDeclarator[];
  kind: 'var' | 'let' | 'const';
}

interface VariableDeclarator extends Node {
  type: NodeType.VariableDeclarator;
  id: Identifier;
  init?: Expression;
}

interface Identifier extends Node {
  type: NodeType.Identifier;
  name: string;
}

interface IfStatement extends Statement {
  type: NodeType.IfStatement;
  test: Expression;
  consequent: Statement;
  alternate?: Statement;
}

interface BlockStatement extends Statement {
  type: NodeType.BlockStatement;
  body: (Statement | Comment)[]; // Array of Statement or Comment
}

interface FunctionDeclaration extends Statement {
  type: NodeType.FunctionDeclaration;
  id: Identifier;
  params: Identifier[];
  body: BlockStatement;
}

interface ClassDeclaration extends Statement {
  type: NodeType.ClassDeclaration;
  id: Identifier;
  body: ClassBody;
}

interface ClassBody extends Node {
  type: NodeType.ClassBody;
  body: (ClassElement | Comment)[]; // Array of ClassElement or Comment
}

interface ClassElement extends Node {
  type: NodeType.ClassElement;
  key: Identifier;
  value: FunctionExpression;
  kind: 'method' | 'constructor';
  static: boolean;
}

interface FunctionExpression extends Node {
  type: NodeType.FunctionExpression;
  params: Identifier[];
  body: BlockStatement;
}

interface ReturnStatement extends Statement {
  type: NodeType.ReturnStatement;
  argument?: Expression;
}

interface Expression extends Node {
  type: NodeType.Literal | NodeType.BinaryExpression | NodeType.UnaryExpression | NodeType.CallExpression | NodeType.MemberExpression | NodeType.ArrayExpression | NodeType.ObjectExpression | NodeType.ArrowFunctionExpression | NodeType.ThisExpression | NodeType.SpreadElement | NodeType.ConditionalExpression;
}

interface Literal extends Expression {
  type: NodeType.Literal;
  value: string | number | boolean;
  raw: string;
}

interface BinaryExpression extends Expression {
  type: NodeType.BinaryExpression;
  operator: string;
  left: Expression;
  right: Expression;
  lineBreak?: number; // Line break options (bitmask)
}

interface UnaryExpression extends Expression {
  type: NodeType.UnaryExpression;
  operator: string;
  argument: Expression;
}

interface CallExpression extends Expression {
  type: NodeType.CallExpression;
  callee: Expression;
  arguments: Expression[];
}

interface MemberExpression extends Expression {
  type: NodeType.MemberExpression;
  object: Expression;
  property: Identifier;
  computed: boolean;
}

interface ArrayExpression extends Expression {
  type: NodeType.ArrayExpression;
  elements: (Expression | null)[]; // Allow null for elision
}

interface ObjectExpression extends Expression {
  type: NodeType.ObjectExpression;
  properties: Property[];
}

interface Property extends Node {
  type: NodeType.Property;
  key: Expression;
  value: Expression;
  kind: 'init';
}

interface ArrowFunctionExpression extends Expression {
  type: NodeType.ArrowFunctionExpression;
  params: Identifier[];
  body: Expression | BlockStatement;
}

interface ThisExpression extends Expression {
  type: NodeType.ThisExpression;
}

interface SpreadElement extends Expression {
  type: NodeType.SpreadElement;
  argument: Expression;
}

interface ConditionalExpression extends Expression {
  type: NodeType.ConditionalExpression;
  test: Expression;
  consequent: Expression;
  alternate: Expression;
  lineBreak?: number; // Line break options (bitmask)
}

interface Comment extends Node {
  type: 'Comment';
  value: string;
  start: number;
  end: number;
}
