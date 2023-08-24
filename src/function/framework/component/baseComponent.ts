export class BaseComponent {
  public _viewName;
  public _update() {
    console.log('update start ')
  }

  public get name(): string {
    return this._viewName
  }
  public set name(name: string) {
    this._viewName = name
  }
}