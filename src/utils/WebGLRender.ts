interface WebGLRenderProps {
  vertexSource?: string;
  fragmentSource?: string;
  width?: number;
  height?: number;
}

class WebGLRender {
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
    if (!this.gl) this.gl = this.canvas.getContext("webgl");
    const { gl } = this;
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
      console.error(linkErrLog);
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
    const { gl, program } = this;

    const resolution = new Float32Array([this.width, this.height]);
    const resolutionLoc = gl.getUniformLocation(program, "iResolution");
    gl.uniform2f(resolutionLoc, resolution[0], resolution[1]);
  }

  toUrl(cb?: (url?: string) => void) {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      if (cb) cb(url);
    });
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
    gl.useProgram(null);
    if (buffers) {
      for (const key in buffers) {
        const buffer = buffers[key];
        if (buffer) gl.deleteBuffer(buffer);
      }
    }
    if (program) gl.deleteProgram(program);
  }
}

const noiseFrag =
`#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / iResolution.xy;
    st.x *= iResolution.x / iResolution.y;
    float r = random(st * 1.0);
    gl_FragColor = vec4(vec3(1.0), r * .2);
}
`;

export {
  WebGLRenderProps,
  WebGLRender,
  noiseFrag
};
