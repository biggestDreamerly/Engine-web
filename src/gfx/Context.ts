import { CanvasConfig } from "./CanvasConfig";

class Context {
  public canvas: HTMLCanvasElement | undefined;
  public GpuAdapter: GPUAdapter //适配器
  public GPUDevice: GPUDevice
  public GPUContext: GPUCanvasContext //上下文
  public GPUQueue: GPUQueue
  public GPUBuffer: GPUBuffer
  public _pixelRatio: number = 1 // 像素比
  public PreferredCanvasFormat: GPUTextureFormat
  async init(canvasConfig: CanvasConfig) {
    if (canvasConfig && canvasConfig.canvas) {

    } else {
      this.canvas = document.createElement('canvas')
      this.canvas.style.position = `absolute`;
      this.canvas.style.top = '100px';
      this.canvas.style.left = '0px';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      console.log(this.canvas, 'this.canvas')
      document.body.appendChild(this.canvas)
    }
    this.GpuAdapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
      // powerPreference: 'low-power',
    });
    if (!this.GpuAdapter) throw new Error('不支持webgpu')
    //** "bgra8unorm-storage"：支持BGRA8 UNORM格式像素格式的存储。*/ 
    //** "depth-clip-control"：支持深度剪裁控制。*/ 
    //** "depth32float-stencil8"：支持32位浮点深度和8位模板格式。*/ 
    //** "indirect-first-instance"：支持间接绘制命令中的第一个实例。*/ 
    //** "rg11b10ufloat-renderable"：支持RG11B10U浮点格式的可渲染。*/ 
    //** "texture-compression-bc"：支持BC纹理压缩格式。*/ 
    this.GPUDevice = await this.GpuAdapter.requestDevice({
      requiredFeatures: [
        "depth-clip-control",
        "depth32float-stencil8",
        "indirect-first-instance",
        "texture-compression-bc",
        "rg11b10ufloat-renderable",
        "bgra8unorm-storage"
      ],
      requiredLimits: {
        minUniformBufferOffsetAlignment: 256, //要求统一缓冲区的偏移量对齐为256字节。
        maxStorageBufferBindingSize: this.GpuAdapter.limits.maxStorageBufferBindingSize // 使用适配器的限制来设置存储缓冲绑定的最大大小。
      }
    });
    if (!this.GPUDevice) throw new Error('不支持webgpu')
    this._pixelRatio = window.devicePixelRatio ?? 1
    this.GPUContext = this.canvas.getContext('webgpu'); // 绑定上下文
    this.PreferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this.GPUContext.configure({
      device: this.GPUDevice,
      format: this.PreferredCanvasFormat,
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
      alphaMode: 'premultiplied',
      colorSpace: `display-p3`,
    });
  }
}

export let webGpuContext = new Context()