# mp2vue

## 概述

将完成的小程序（比如微信小程序）转为基于 vue 的自研小程序。

 
| 微信                                                 | vue                        |
|------------------------------------------------------|----------------------------|
| js | main.js |
| wcss,wxml | render.js                       |
| - | worker.js                  |
| - | render.js           |
| - | index.html           |

### main.js

```js

__init({
  // App

  app() {
    // app.js 及其引用被打包后的结果
  },

  // 页面

  pages: {
    "/pages/log/log": function () {
      // log.js 及其引用被打包后的结果
    },
    "/pages/index/index": function () {
      // index.js 及其引用被打包后的结果
    },
  },

  // 自定义组件

  components: {
    "/components/userList/index": function () {
      // userList/index.js 及其引用被打包后的结果
    },
  },
});
```

### render.js

```js

import "./main.css";

import c0 from "./pages/log/log.vue";

import c1 from "./pages/index/index.vue";

const pages = {
  "/pages/log/log": c0,
  "/pages/index/index": c1,
};

// 通过 template.html 中的 script src 获取当前页面路径

const path = getCurrentPagePath();

__init(pages[path]);
```

### xxx.vue

```xml
<template>
  <!-- log.wxml 被转换成了 Vue 模板 -->
</template>

<style>


  <!-- log.wcss 作为 Vue 组件的样式被插入到了这里 -->
</style>

<script>
  // 这部分代码将由编译器生成，为渲染层提供一个最最基础的 Vue 组件
  export default {
    pathKey: '/pages/log/log',
    // 注入路径信息
    components: {
      // ...注入该组件依赖的组件
    }
  }
</script>
```

### index.html

```html
<!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />

     <meta
       name="viewport"
       content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
     />
   </head>

   <body>
     <div id="app"></div>

     <!-- 渲染层的基础库 -->

     <script src="render.js"></script>

     <!-- 所有模板和样式的合并文件 -->

     <script src="main.js?page=pagePath"></script>
   </body>
 </html>
```


## template

### vue3 compiler

### how to use ?

```js
import {
  baseParse as parse,
  transform,
  CompilerOptions,
  generate
} from '@vue/compiler-core'

1. parse

const ast = parse("'<input v-model="model" />'")
 transform(ast, {
   nodeTransforms: [transformElement],
   directiveTransforms: {
     model: transformModel
   },
   ...options
 })
// 2. transform
// 3. generate
generate(ast).code



// parse 详细过程，用于 debug

// https://github.com/vuejs/vue-next/blob/master/packages/template-explorer/src/index.ts
import { compile } from '@vue/compiler-dom'
import { compile as ssrCompile } from '@vue/compiler-ssr'
let lastSuccessfulCode: string
let lastSuccessfulMap: SourceMapConsumer | undefined = undefined
function compileCode(source: string): string {
    console.clear()
    try {
      const errors: CompilerError[] = []
      const compileFn = ssrMode.value ? ssrCompile : compile
      
      const { code, ast, map } = compileFn(source, {
        filename: 'ExampleTemplate.vue',
        ...compilerOptions,
        sourceMap: true,
        onError: err => {
          errors.push(err)
        }
      })
    } catch (e) {
      lastSuccessfulCode = `/* ERROR: ${
        e.message
      } (see console for more info) */`
      console.error(e)
    }
    return lastSuccessfulCode
  }
 ```



options: 

```js
// https://github.com/vuejs/vue-next/blob/master/packages/template-explorer/src/options.ts
{
  mode: 'module',
  filename: 'Foo.vue',
  prefixIdentifiers: false,
  hoistStatic: false,
  cacheHandlers: false,
  scopeId: null,
  inline: false,
  ssrCssVars: `{ color }`,
  compatConfig: { MODE: 3 },
  whitespace: 'condense',
  bindingMetadata: {
    TestComponent: BindingTypes.SETUP_CONST,
    setupRef: BindingTypes.SETUP_REF,
    setupConst: BindingTypes.SETUP_CONST,
    setupLet: BindingTypes.SETUP_LET,
    setupMaybeRef: BindingTypes.SETUP_MAYBE_REF,
    setupProp: BindingTypes.PROPS,
    vMySetupDir: BindingTypes.SETUP_CONST
  }
}
```


try it online : https://vue-next-template-explorer.netlify.app

### 组件&属性

before:

```
<view id={{id}} class="static-class {{ dynamicClassFlag ? 'dynamic-class': ''}}">test</view>
```

how:

```js
const isDataBinding = (v) => {
  return (/{{(.+?)}}/).test(value.trim());
};

/**
 * 获取{{}}数据绑定模板表达式
 * @param {*} value
 */
const retriveExp = (v) => {
  const match = !isEmptyString(v) && /{{(.+?)}}/.exec(v);
  return (match == null) ? value : match[1].trim();
};

function transformClassAtrr(node) {
  const { attribs } = node;
  const v = attribs[attr];
  if (isDataBinding(v)) {
    // dosomething, then set attribs
  }
  return attribs;
}
```

after:

```
<prefix-view :id="id" class="static-class" :class="dynamicClassFlag ? 'dynamic-class': ''">test</prefix-view>
```


### 指令


| 微信                                                 | vue                        |
|------------------------------------------------------|----------------------------|
| wx:for="{{array}}" wx:for-item="item"wx:for-index="i" | v-for="(item, i) in array" |
| wx:if                                                | v-if                       |
| wx:elif                                              | v-else-if                  |
|                        wx:else                       |           v-else           |

### 事件


before:

```
<button type="primary" data-type="tap" bindtap="showToast">tap</button>
<button type="primary" data-type="longpress" bindlongpress="showToast">longpress</button>
```

after:

```
<prefix-button type="primary" @tap.native="__eventHandleProxy__('showToast', $event)">tap</prefix-button>
<prefix-button type="primary" @press.native="__eventHandleProxy__('showToast', $event)">longpress</prefix-button>

```

### expected

```js
vm = new Vue({
  data: options.data, // 小程序中定义的data
  render: options.render, // 就是将上文中的 after 编译后的 render function
  methods: {
    // 可通过 ipc 转发到 worker 进程，执行对应的逻辑。
    __eventHandleProxy__(eventName: string, event: Event) {
      ipcSend(eventName, event);
    }
  }
});
```

## reference

- [知乎小程序架构](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651242645&idx=1&sn=b63c8d4ac1a1534c153ed49699fcb64c&chksm=bd4919118a3e900725c2d93816ef86bc4c86f6363c64750932c596fe5507b232ef17a882dd09&scene=27#wechat_redirect)

