// @ts-ignore
import { generate, compile } from "vue-template-compiler";
import TemplateTransform from "./vue-template-ast-to-template/lib/index";

const template = `<view  bindtap={{handleClick}}>click me</view>`;
const { ast } = compile(template);
ast.attrs = [{ name: "@click", value: '"handleClick"' }];
// console.log(ast);
// console.log(generate(ast, {}));
class NewTemplateTransform extends TemplateTransform {}

const newTemplateTranformer = new NewTemplateTransform({
  prefix: "foo",
});
export default newTemplateTranformer.generate(ast).code;
