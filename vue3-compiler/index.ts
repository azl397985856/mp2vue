// import vueDOM from "@vue/compiler-dom";
import {
  generate,
  transform,
  baseParse as parse,
  transformElement,
  NodeTypes,
  RootNode,
  DirectiveNode,
  // transformOn,
  // transformModel,
  // transformBind,
  TemplateChildNode,
} from "@vue/compiler-core";
// import template from "../vue2-compiler/index";

const transformations = [
  transformElement,
  (node: RootNode | TemplateChildNode) => {
    if (node.type === NodeTypes.ROOT) {
    } else if (node.type === NodeTypes.ELEMENT) {
      node.tag = "bnc-" + node.tag;
      for (const i in node.props) {
        const attr = node.props[i];
        if (attr.type === NodeTypes.ATTRIBUTE) {
          const m = attr.value.content.match(/\{\{(.+)\}\}/);
          if (m && m[1]) {
            if (attr.name.startsWith("bind")) {
              const dir: DirectiveNode = {
                type: NodeTypes.DIRECTIVE,
                modifiers: [],
                name: "on",
                exp: {
                  type: NodeTypes.SIMPLE_EXPRESSION,
                  isStatic: false,
                  constType: 0,
                  loc: attr.loc, // ??
                  content: m[1],
                },
                arg: {
                  content: `"${attr.name.slice(4)}"`,
                  type: NodeTypes.SIMPLE_EXPRESSION,
                  isStatic: false,
                  constType: 0,
                  loc: attr.loc, // ??
                },
                loc: attr.loc,
              };
              node.props[i] = dir;
            } else {
              attr.value.content = m[1];
            }
          }
        }
      }
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
      // once,
      // for,
      if(d, node) {
        // console.log(d);
        return {
          props: [],
        };
      },
      // on: (d, node) => {
      //   // console.log(d, node);
      //   return {
      //     props: [],
      //   };
      // },
      model: (d, node) => {
        // console.log(d, node);
        return {
          props: [],
        };
      },
      bind: (directive, node) => {
        // console.log(d, node);
        return {
          props: [],
        };
      },
    },
  });
  return generate(ast);
}
const template = `<view  bindtap={{handleClick}} type="primary" size={{config.size}}>click me</view>`;
const { ast, code } = compile(template);

console.log(code);
