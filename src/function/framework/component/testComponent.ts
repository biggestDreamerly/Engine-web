import { testSystem } from "../../system/testSystem";
import { BaseComponent } from "./baseComponent";

export class testComponent extends BaseComponent {
  public n: number = 1
  constructor() {
    super();
    this.init()
  }
  public init() {
    testSystem.add(this, {})
  }
}