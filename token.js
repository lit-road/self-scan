const acorn = require("acorn");
const code = `
var a = 0;
function foo() {
    const b = "2";
    console.log(a + b);
    return [a, b, {a, b}];
}
foo();
`
const tokens = acorn.tokenizer(code);

let tokenArray = [];
while (true) {
    const token = tokens.getToken();
    if (token.type.label === "eof") break;
    tokenArray.push(token.value || token.type.label);
}

console.log(tokenArray);

const ast = acorn.parse(code, { ecmaVersion: 2020 })
console.log(JSON.stringify(ast, null, 2))