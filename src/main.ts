import { Engine } from "./Engine"
import { logComponent } from "./function/framework/component/logComponent"
import { testComponent } from "./function/framework/component/testComponent"
import { GameObject } from "./function/framework/object/gameObject"

let demo = null
let demo1 = null
async function init() {
  await new Engine().init({})
  Engine.startRender()
  for (let index = 0; index < 2; index++) {
    new GameObject().addComponent(logComponent)

  }
  demo1 = new GameObject()
  let c = demo1.addComponent(logComponent)
  c.name = '测试'
  console.log(c, '组件名字')
  demo1.getComponent('name')

}
var button = document.createElement("button");
button.innerHTML = "Click Me";

// 按钮点击事件处理函数
function handleClick() {
  // demo.components.get('logComponent').n += 2
  // demo1.components.get('logComponent').n += 5
  // console.log(demo)
}

// 添加点击事件监听器
button.addEventListener("click", handleClick);

// 将按钮添加到页面中
document.body.appendChild(button);

// 触发按钮点击事件
button.click();
init()