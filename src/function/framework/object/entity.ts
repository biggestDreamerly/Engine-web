export class Entity {
  public name: string = ''

  protected readonly _uuid: string = ''

  public get uuid(): string {
    return this._uuid;
  }
  public components: Map<any, any> = new Map()


}