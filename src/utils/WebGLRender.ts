import { toUrl } from "./canvasHelper";

export interface WebGLRenderProps {
  vertexSource?: string;
  fragmentSource?: string;
  width?: number;
  height?: number;
}

export class WebGLRender {
  frags: string[] = [];
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  width: number = 200;
  height: number = 200;

  buffers: {
    vertices?: WebGLBuffer;
    [key: string]: WebGLBuffer;
  } = {};

  // default vertex shader source.
  vertexSource =
`#ifdef GL_ES
precision mediump float;
#endif
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  // default fragment shader source.
  fragmentSource =
`#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texcoord;
void main(){
  gl_FragColor = vec4(0.0);
}`;

  constructor(props: WebGLRenderProps) {
    Object.assign(this, props);
    this.init();
  }

  init() {
    if (!this.canvas) this.canvas = document.createElement("canvas");
    if (!this.gl) {
      this.gl = this.canvas.getContext("webgl") || (
        this.canvas.getContext("experimental-webgl") as WebGLRenderingContext
      );
    }
    const { gl } = this;
    if (!this.gl) return;
    if (!this.program) this.program = gl.createProgram();

    gl.clearDepth(1.0);                                  // Clear everything.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas before we start drawing on it.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.DEPTH_TEST);                            // Enable depth testing.
    gl.depthFunc(gl.LEQUAL);                             // Near things obscure far things.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                   // Clear to black, fully opaque
  }

  render() {
    const { gl, program, canvas, width, height, vertexSource, fragmentSource } = this;
    canvas.width = width;
    canvas.height = height;

    const enableRunRender = [gl, program, canvas, width, height, vertexSource, fragmentSource].every(isExisted => Boolean(isExisted));
    if (!enableRunRender) return;

    const shaderSources = [{ source: vertexSource, type: gl.VERTEX_SHADER }, { source: fragmentSource, type: gl.FRAGMENT_SHADER }];
    const glShaders = shaderSources.map(shaderSource => {
      const { source, type } = shaderSource;
      const glShader = gl.createShader(type);
      gl.shaderSource(glShader, source);
      gl.compileShader(glShader);
      return glShader;
    });

    glShaders.forEach(glShader => {
      gl.attachShader(this.program, glShader);
    });
    gl.linkProgram(program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const linkErrLog = gl.getProgramInfoLog(this.program);
      console.log(linkErrLog);
      this.cleanup();
      return;
    }

    this.setAttribs();

    glShaders.forEach(glShader => {
      gl.detachShader(this.program, glShader);
      gl.deleteShader(glShader);
    });

    gl.viewport(0, 0, this.width, this.height);
    gl.useProgram(this.program);
    this.setUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.cleanup();
  }

  setAttribs() {
    const { gl, program } = this;

    const verticesLoc = gl.getAttribLocation(program, "a_position");
    this.buffers.vertices = gl.createBuffer();
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(verticesLoc);
    this.gl.vertexAttribPointer(verticesLoc, 2, gl.FLOAT, false, 0, 0);
  }

  setUniforms() {
    const { gl, program, width, height } = this;
    const resolution = new Float32Array([width, height]);
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLoc, resolution[0], resolution[1]);
  }

  clearAlpha() {
    const { gl } = this;

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(1, 1, 1, 1);
    gl.colorMask(false, false, false, true);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  cleanup() {
    const { gl, program, buffers } = this;
    if (!gl) return;
    gl.useProgram(null);
    if (buffers) {
      for (const key in buffers) {
        const buffer = buffers[key];
        if (buffer) gl.deleteBuffer(buffer);
      }
    }
    if (program) gl.deleteProgram(program);
  }

  toUrl(cb?: (url?: string) => void) {
    toUrl(this.canvas, cb);
  }
}

// @link https://thebookofshaders.com/edit.php#06/hsb-colorwheel.frag
export const colorWheelFrag =
`#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
}
`;

export const getNoiseFrag = (color: { r: string; g: string; b: string; }) =>
`#ifdef GL_ES
precision highp float;
#endif
uniform vec2 u_resolution;

// @link http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float random(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt= dot(co.xy ,vec2(a,b));
  highp float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;
  float r = random(st * 1.);
  gl_FragColor = vec4(${color.r}, ${color.g}, ${color.b}, r * .2);
}
`;
