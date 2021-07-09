// import vueDOM from "@vue/compiler-dom";
import {
  generate,
  transform,
  baseParse as parse,
  transformElement,
  NodeTypes,
  RootNode,
  transformBind,
  TemplateChildNode,
} from "@vue/compiler-core";

const transformations = [
  transformElement,
  (node: RootNode | TemplateChildNode) => {
    if (node.type === NodeTypes.ROOT) {
    } else if (node.type === NodeTypes.ELEMENT) {
      node.tag = "bnc-" + node.tag;
    } else if (node.type === NodeTypes.TEXT) {
      node.content = "click you";
    } else {
    }
  },
];
function compile(template: string) {
  const ast = parse(template);

  transform(ast, {
    // prefixIdentifiers: true,
    nodeTransforms: transformations,
    directiveTransforms: {
      bind: transformBind,
    },
  });
  return generate(ast);
}
const template = `<view  @click="handleClick">click me</view>`;
const { ast, code } = compile(template);

console.log(code);
