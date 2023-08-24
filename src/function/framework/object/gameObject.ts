import { Entity } from "./entity";

export class GameObject extends Entity {
  //todo 记得修改component的类型
  public addComponent(c: any) {
    this.components.set(c.name, new c())
    return new c();
  }
  public getComponent(name: string) {
    console.log(this.components)
  }
}