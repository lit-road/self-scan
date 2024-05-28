# js 是如何执行的


## 分词/词法分析

> 源码位置
> https://github.com/v8/v8/blob/main/src/parsing/scanner.cc

- 将字符串分解成有意义的代码块，这些代码块被称为词法单元
- 例如：var a = 2; 将被分解为 var、a、=、2、;
- 分词器会忽略空格和换行符
- 词法单元是由一种数据结构组成，称为词法单元流
- 词法单元流是一个由一个个词法单元组成的数组
- 词法单元流是由分词器生成的
- 词法单元流是一个有序的数组

举例：
```js
var a = 0;
function foo() {
    const b = "2"
    console.log(a + b);
    return [a, b, {a, b}];
}

foo();
```
词法分析如下：
```js
[
    "var", "a", "=", "0", ";",
    "function", "foo", "(", ")", "{",
    "const", "b", "=", "\"2\"", ";",
    "console", ".", "log", "(", "a", "+", "b", ")", ";",
    "return", "[", "a", ",", "b", ",", "{", "a", ",", "b", "}", "]", ";",
    "}", "foo", "(", ")", ";"
]
```

验证：

> node 21

```js
const acorn = require("acorn");
const tokens = acorn.tokenizer(`
var a = 0;
function foo() {
    const b = "2";
    console.log(a + b);
    return [a, b, {a, b}];
}
foo();
`);

let tokenArray = [];
while (true) {
    const token = tokens.getToken();
    if (token.type.label === "eof") break;
    tokenArray.push(token.value || token.type.label);
}
console.log(tokens)
console.log(tokenArray);

// output：
[
    'var',    'a',        '=',     'num',
    ';',      'function', 'foo',   '(',
    ')',      '{',        'const', 'b',
    '=',      '2',        ';',     'console',
    '.',      'log',      '(',     'a',
    '+',      'b',        ')',     ';',
    'return', '[',        'a',     ',',
    'b',      ',',        '{',     'a',
    ',',      'b',        '}',     ']',
    ';',      '}',        'foo',   '(',
    ')',      ';'
]
```

可以发现 acorn 生成的 token 与我们手动分词的结果基本一致。
但是 0 被转为 num 。

## 解析/语法分析

> 源码位置
> https://github.com/v8/v8/blob/main/src/ast/ast.cc

- 将词法单元流转换为抽象语法树（AST）
- AST 是一个由节点组成的树状结构
- AST 是由解析器生成的
- AST 生成的同时，会进行Scope Analysis
- Scope Analysis 会生成一个 Scope Tree，用于表示变量的作用域
- Scope Analysis 会提升变量的声明，将变量声明提升到作用域的顶部
- Scope Analysis 会将变量的引用与声明关联起来，

举例：
```js
var a = 0;
function foo() {
    const b = "2"
    console.log(a + b);
    return [a, b, {a, b}];
}

foo();
```

验证：
```js
const acorn = require("acorn");

const code = `
var a = 0;
function foo() {
    const b = "2";
    console.log(a + b);
    return [a, b, {a, b}];
}

foo();
`;

const ast = acorn.parse(code, { ecmaVersion: 2020 });
console.log(JSON.stringify(ast, null, 2));
```

输出结果：
```json
{
  "type": "Program",
  "start": 0,
  "end": 108,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 1,
      "end": 11,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 5,
          "end": 10,
          "id": {
            "type": "Identifier",
            "start": 5,
            "end": 6,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 9,
            "end": 10,
            "value": 0,
            "raw": "0"
          }
        }
      ],
      "kind": "var"
    },
    {
      "type": "FunctionDeclaration",
      "start": 12,
      "end": 100,
      "id": {
        "type": "Identifier",
        "start": 21,
        "end": 24,
        "name": "foo"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 27,
        "end": 100,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 33,
            "end": 47,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 39,
                "end": 46,
                "id": {
                  "type": "Identifier",
                  "start": 39,
                  "end": 40,
                  "name": "b"
                },
                "init": {
                  "type": "Literal",
                  "start": 43,
                  "end": 46,
                  "value": "2",
                  "raw": "\"2\""
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 52,
            "end": 71,
            "expression": {
              "type": "CallExpression",
              "start": 52,
              "end": 70,
              "callee": {
                "type": "MemberExpression",
                "start": 52,
                "end": 63,
                "object": {
                  "type": "Identifier",
                  "start": 52,
                  "end": 59,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 60,
                  "end": 63,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "BinaryExpression",
                  "start": 64,
                  "end": 69,
                  "left": {
                    "type": "Identifier",
                    "start": 64,
                    "end": 65,
                    "name": "a"
                  },
                  "operator": "+",
                  "right": {
                    "type": "Identifier",
                    "start": 68,
                    "end": 69,
                    "name": "b"
                  }
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ReturnStatement",
            "start": 76,
            "end": 98,
            "argument": {
              "type": "ArrayExpression",
              "start": 83,
              "end": 97,
              "elements": [
                {
                  "type": "Identifier",
                  "start": 84,
                  "end": 85,
                  "name": "a"
                },
                {
                  "type": "Identifier",
                  "start": 87,
                  "end": 88,
                  "name": "b"
                },
                {
                  "type": "ObjectExpression",
                  "start": 90,
                  "end": 96,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 91,
                      "end": 92,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 91,
                        "end": 92,
                        "name": "a"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 91,
                        "end": 92,
                        "name": "a"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 94,
                      "end": 95,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 94,
                        "end": 95,
                        "name": "b"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 94,
                        "end": 95,
                        "name": "b"
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 101,
      "end": 107,
      "expression": {
        "type": "CallExpression",
        "start": 101,
        "end": 106,
        "callee": {
          "type": "Identifier",
          "start": 101,
          "end": 104,
          "name": "foo"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "script"
}
```

字段注释
```code
// 顶层结构
type: 节点类型
    Program: 表示程序
    VariableDeclaration: 表示变量声明
    FunctionDeclaration: 函数声明
        expression
        generator: 回调函数是生成表达式。
        async
        params: 函数参数数组，这里为空数组表示无参数。
        body: 函数体
    ExpressionStatement: 表达式
    BlockStatement: 块表达式
        body: 包含语句块内语句的数组。
    CallExpression: 函数调用
        callee: 被调用的函数
        arguments: 参数
    MemberExpression: 对象访问的属性
    Property: 
        描述对象的各种特性
    BinaryExpression: 二次元表达式
        left
        operator
        right
    ReturnStatement: 返回值
    ObjectExpression: 对象表达式
    ArrayExpression
    ...

start: 节点在源代码中的起始位置（字符索引）。
end: 节点在源代码中的结束位置（字符索引）。
body: 包含程序主体的数组，每个元素代表一个语句或声明。
declarations: 包含一个或多个变量声明的数组。
kind: 变量类型
    const
    let
    var
    init: 初始化属性

```

## AST 优化

- AST 优化是一个可选的步骤


### 基本转换、优化步骤

1 语法树遍历
引擎会遍历AST节点，并根据特定规则进行转换。例如，某些语法糖（如箭头函数、解构赋值等）会被转换成更基本的结构。

2 内联扩展（Inlining）
内联扩展是一种优化技术，将被频繁调用的小函数的代码内联到调用处，减少函数调用开销。

3 恒值折叠（Constant Folding）
在这个阶段，编译器会计算可以在编译时确定的常量表达式。例如，将2 + 2直接替换为4。

4 死代码消除（Dead Code Elimination）
编译器会删除那些永远不会被执行的代码。例如，if (false) { ... }内的代码块会被移除。

5 Intermediate Representation 生成与优化
   内联、恒值折叠和死代码消除等优化步骤会生成一个更高级的中间表示（IR）。
...

### 工具

https://astexplorer.net/

## 代码生成

- 将优化后的AST转换为机器码
- 机器码是一种可以被计算机直接执行的代码


# js 中高大上的专有名词 （术语）

## 词法作用域

- 词法作用域是指在代码编写时定义的作用域
- 词法作用域是由代码的结构决定的
- 词法作用域是静态的，不会随着代码的执行而改变

举例：
```js
var a = 0;
function foo() {
    console.log(a);
}
foo();
```
## 函数（动态）作用域

- 函数作用域是指在函数调用时定义的作用域
- 函数作用域是由函数的调用决定的
- 函数作用域是动态的，会随着函数的调用而改变

举例：
```js

```

## 作用域链

- 作用域链是一个由作用域组成的链表
- 作用域链是由作用域嵌套关系决定的

举例：
```js
var a = 0;
function foo() {
    var b = 1;
    function bar() {
        var c = 2;
        console.log(a, b, c);
    }
    bar();
}
foo();
```

## 闭包

- 闭包是指一个函数和其相关的引用环境
- 闭包可以访问其引用环境中的变量

举例：
```js   
function foo() {
    var a = 0;
    return function() {
        console.log(a);
    };
}
var bar = foo();
console.log(a)
bar();
```