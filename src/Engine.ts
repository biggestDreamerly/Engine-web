
import { emitBeforeRender } from "./function/event/onBeforEvent";
import { logSystem } from "./function/system/logSystem";
import { CanvasConfig } from "./gfx/CanvasConfig";
import { webGpuContext } from "./gfx/Context";

export class Engine {
  public static setting = {
    // engine setting 
  }
  private _frameRate: number = 240;
  private _frameRateValue: number = 0;
  private _deltaTime: number = 0;


  private static render(delta) {
    emitBeforeRender()
    // logSystem.update(logSystem.queued)
    this.resume()

  }

  public static startRender() {
    this.resume()
  }

  public static resume() {
    requestAnimationFrame((t) => this.render(t));
  }

  async init(config: {
    CanvasConfig?: CanvasConfig
  }) {

    await webGpuContext.init(config.CanvasConfig)

    console.log("webgpu init success")
  }

}
