import { logSystem } from "../../system/logSystem";
import { BaseComponent } from "./baseComponent";

export class logComponent extends BaseComponent {
  public n: number = Math.random()

  constructor() {
    super();
    this.init()
    this._viewName = 'logComponent'
  }
  public init() {
    logSystem.add(this, {})
  }

  public rename(name: string) {
    this._viewName = name
  }
}