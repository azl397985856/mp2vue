// @ts-ignore
import { generate, compile } from "vue-template-compiler";
import TemplateTransform from "./vue-template-ast-to-template/lib/index";

const template = `<view  bindtap={{handleClick}}>click me</view>`;
const { ast } = compile(template);
ast.attrs = [{ name: "@click", value: '"handleClick"' }];
// console.log(ast);
// console.log(generate(ast, {}));
class NewTemplateTransform extends TemplateTransform {}

// get an instance
const newTemplateTranformer = new NewTemplateTransform({
  // some options
  prefix: "foo",
});
console.log(newTemplateTranformer);
// inject the origin vue template ast and call generate method of transformer instance to get the transformed template
const ans = newTemplateTranformer.generate(ast);

console.log(ans);
