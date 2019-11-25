/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Hello_GLSL
 */

// export interface WebGLRenderProps {
//   frags?: string[];
//   width?: number;
//   height?: number;
// }

class WebGLRender {
  // frags: string[] = [];
  // canvas: HTMLCanvasElement;
  // gl: WebGLRenderingContext;
  // program: WebGLProgram;
  // buffers: { "" };
  buffers = {}

  // constructor(props: WebGLRenderProps) {
  constructor(props) {
    Object.assign(this, props)
    this.initBase()
    this.init()
  }

  initBase() {
    if (!this.canvas) this.canvas = document.createElement('canvas')
    this.canvas.style.background = 'red'
    document.body.appendChild(this.canvas)

    if (!this.gl) this.gl = this.canvas.getContext('webgl')
    const { gl } = this
    if (!this.program) this.program = gl.createProgram()

    gl.clearDepth(1.0)                 // Clear everything
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.enable(gl.DEPTH_TEST)           // Enable depth testing
    gl.depthFunc(gl.LEQUAL)            // Near things obscure far things
    gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
  
  }

  init() {
    const { gl, program, canvas, width, height } = this
    canvas.width = width
    canvas.height = height

    if (!this.shaders) return
    const glShaders = this.shaders.map(shader => {
      const { shaderText, type } = shader
      const glShader = gl.createShader(gl[type])
      gl.shaderSource(glShader, shaderText)
      gl.compileShader(glShader)
      return glShader
    })

    glShaders.forEach(glShader => {
      gl.attachShader(this.program, glShader)
    })
    gl.linkProgram(program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const linkErrLog = gl.getProgramInfoLog(this.program)
      console.log(linkErrLog)
      this.cleanup()
      return
    }
    
    this.setAttrib()

    glShaders.forEach(glShader => {
      gl.detachShader(this.program, glShader)
      gl.deleteShader(glShader)
    })

    gl.viewport(0, 0, this.width, this.height)
    gl.useProgram(this.program)
    this.setUniforms()
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    // this.clearAlpha()
    this.cleanup()
  }

  clearAlpha() {
    const { gl } = this

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(1, 1, 1, 1)
    gl.colorMask(false, false, false, true)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  cleanup() {
    const { gl, program, buffer } = this
    gl.useProgram(null)
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
  }

  setAttrib() {
    const { gl, program } = this

    const verticesLoc = gl.getAttribLocation(program, 'a_position')
    this.buffers.vertices = gl.createBuffer()
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices)
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray(verticesLoc)
    this.gl.vertexAttribPointer(verticesLoc, 2, gl.FLOAT, false, 0, 0)
  }

  setUniforms() {
    const { gl, program } = this

    const resolution = new Float32Array([screen.availWidth, screen.availHeight])
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
    gl.uniform2f(resolutionLoc, resolution[0], resolution[1])
  }

  // toUrl(cb?: (url?: string) => void) {
  toUrl(cb) {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      if (cb) cb(url)
    })
  }
}

const noiseFrag =
`// Title: Random

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    float r = random(st * 1.0);
    gl_FragColor = vec4(vec3(1.0), r);
}
`
const blackFrag =
`#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texcoord;
void main(){
    gl_FragColor = vec4(0.0);
}`

const vertText =
`#ifdef GL_ES
precision mediump float;
#endif
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

const shaders = [{
  shaderText: vertText,
  type: 'VERTEX_SHADER'
}, {
  shaderText: noiseFrag,
  type: 'FRAGMENT_SHADER'
}]

const webGLRender = new WebGLRender({ shaders, width: 200, height: 200 })
console.log(webGLRender)
webGLRender.toUrl(url => {
  const img = document.createElement('img')
  document.body.style.background = 'red'
  img.style.background = 'red'
  img.src = url
  document.body.append(img)
})
