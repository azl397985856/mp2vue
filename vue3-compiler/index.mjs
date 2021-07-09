import vueDOM from "@vue/compiler-dom";
import vueCore from "@vue/compiler-core";
const { compile } = vueDOM;
const { generate, transform } = vueCore;
const { ast } = compile(`'<view bintap={{handleClick}} />'`);

const g = generate(ast);

// transform(g.ast, {});
console.log(g.ast, g.code);
