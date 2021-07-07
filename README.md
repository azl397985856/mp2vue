# mp2vue

## template

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
| wx:for="{{array}}" wx:for-item="item"wx:for-index="i | v-for="(item, i) in array" |
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

