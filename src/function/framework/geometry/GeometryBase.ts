import { webGpuContext } from "../../../gfx/Context";

export class GeometryBase {

  public width: number;
  public height: number;
  public depth: number;
  constructor(width: number = 1, height: number = 1, depth: number = 1) {
    this.depth = depth;
    this.width = width;
    this.height = height;
  }

  private init(){

    const renderPass = webGpuContext.GPUDevice

  }
  
}