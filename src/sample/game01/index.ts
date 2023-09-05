import triangleVert from '../../../src/function/shader/triangle.vert.wgsl?raw'
import redFrag from '../../../src/function/shader/red.frag.wgsl?raw'
import { vertex, vertexCount } from './data'
import { mat4, vec3, vec4 } from 'gl-matrix'
// initialize webgpu device & config canvas context
async function initWebGPU(canvas: HTMLCanvasElement) {
  if (!navigator.gpu)
    throw new Error('Not Support WebGPU')
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance'
    // powerPreference: 'low-power'
  })
  if (!adapter)
    throw new Error('No Adapter Found')
  const device = await adapter.requestDevice()
  const context = canvas.getContext('webgpu') as GPUCanvasContext
  const format = navigator.gpu.getPreferredCanvasFormat()
  const devicePixelRatio = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * devicePixelRatio
  canvas.height = canvas.clientHeight * devicePixelRatio
  const size = { width: canvas.width, height: canvas.height }
  context.configure({
    // json specific format when key and value are the same
    device, format,
    // prevent chrome warning
    alphaMode: 'opaque'
  })
  return { device, context, format, size }
}
// create a simple pipiline
async function initPipeline(device: GPUDevice, format: GPUTextureFormat, size: { width: number, height: number }): Promise<{ pipeline: GPURenderPipeline, vertexObj: any, colorObj: any, mvpMatrix: any }> {

  const vertexBuffer = device.createBuffer({
    size: vertex.byteLength, //大小
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST // 表示可以被拷贝 // 用途 干啥用的
  }) //给gpu 创建buffer
  device.queue.writeBuffer(vertexBuffer, 0, vertex) //拷贝写入数据

  const color = new Float32Array([.1, 0.4, 0, 1])
  const colorBuffer = device.createBuffer({
    size: color.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })
  device.queue.writeBuffer(colorBuffer, 0, color)
  const mvpMatrix = device.createBuffer({
    size: 4 * 4 * 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })
  const descriptor: GPURenderPipelineDescriptor = {
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: triangleVert
      }),
      entryPoint: 'main',
      buffers: [{
        arrayStride: 3 * 4, //一个占用4个字节 所以是3 * 4
        attributes: [
          {
            shaderLocation: 0, //传递的是第一个shaderlocation
            offset: 0, //偏移
            format: 'float32x3'
          },
        ]
      }]
    },
    primitive: {
      topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
    },
    fragment: {
      module: device.createShaderModule({
        code: redFrag
      }),
      entryPoint: 'main',
      targets: [
        {
          format: format
        }
      ]
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: "depth24plus"
    }
  }
  const depthTexture = device.createTexture({
    size,
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  })

  const vertexObj = {
    vertexBuffer, vertex,
    vertexCount: vertexCount

  }
  const pipeline = await device.createRenderPipelineAsync(descriptor)
  const group = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: colorBuffer
        }
      },
      {
        binding: 1,
        resource: {
          buffer: mvpMatrix
        }
      },
    ]
  })
  const colorObj = {
    color, colorBuffer, group
  }
  return { pipeline, vertexObj, colorObj, mvpMatrix, depthTexture }
}
// create & submit device commands
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline, vertex: any, colorObj: any, depthTexture: any) {
  const commandEncoder = device.createCommandEncoder()
  const view = context.getCurrentTexture().createView()
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: view,
        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        loadOp: 'clear', // clear/load
        storeOp: 'store' // store/discard
      }
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    }
  }
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
  passEncoder.setPipeline(pipeline) //设置管线
  passEncoder.setVertexBuffer(0, vertex.vertexBuffer)
  passEncoder.setBindGroup(0, colorObj.group)
  // 3 vertex form a triangle
  passEncoder.draw(vertex.vertexCount)
  passEncoder.end()
  // webgpu run in a separate process, all the commands will be executed after submit
  device.queue.submit([commandEncoder.finish()])
}

async function run() {
  const canvas = document.querySelector('canvas')
  if (!canvas)
    throw new Error('No Canvas')
  const { device, context, format } = await initWebGPU(canvas)
  const { pipeline, vertexObj, colorObj, mvpMatrix, depthTexture } = await initPipeline(device, format, canvas)
  //创建一个盒子的矩阵
  const position = { x: 0, y: 0, z: -6 }
  const scale = { x: 1, y: 1, z: 1 }
  const rotation = { x: 0.5, y: 0, z: 0 }


  // re-configure context on resize
  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    // don't need to recall context.configure() after v104
    draw(device, context, pipeline, vertexObj, colorObj, depthTexture)
  })

  const Frame = () => {
    requestAnimationFrame(Frame)
  }

  Frame()
  
  setInterval(() => {
    rotation.y += 0.01
    rotation.x += 0.01

    const modeViewMatrix = mat4.create()
    mat4.translate(modeViewMatrix, modeViewMatrix, vec3.fromValues(position.x, position.y, position.z))
    mat4.rotateX(modeViewMatrix, modeViewMatrix, rotation.x)
    mat4.rotateY(modeViewMatrix, modeViewMatrix, rotation.y)
    mat4.rotateZ(modeViewMatrix, modeViewMatrix, rotation.z)
    mat4.scale(modeViewMatrix, modeViewMatrix, vec3.fromValues(scale.x, scale.y, scale.z))
    //创建我们的投影矩阵
    const projectMatrix = mat4.create()
    mat4.perspective(projectMatrix, Math.PI / 2, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0)
    const Matrix = mat4.create()
    mat4.multiply(Matrix, projectMatrix, modeViewMatrix)
    device.queue.writeBuffer(mvpMatrix, 0, Matrix as Float32Array)
    //将两个矩阵相乘的到一个新矩阵
    // start draw
    draw(device, context, pipeline, vertexObj, colorObj, depthTexture)
  }, 20)

}
run()

