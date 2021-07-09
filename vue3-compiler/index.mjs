import vueDOM from "@vue/compiler-dom";
import vueCore from "@vue/compiler-core";
const { compile } = vueDOM;
const { generate, transform, baseParse as parse } = vueCore;
const transformations = [(node, context, option) => null]
function compile(template) {
  const ast = parse(template)
  transform(ast, transformations)
  return generate(ast)
}

const { ast, code } = compile(`'<view bintap={{handleClick}} />'`);
console.log(ast, code)
