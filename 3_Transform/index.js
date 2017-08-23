// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_xformMatrix;
  void main() {
    gl_Position = a_Position * u_xformMatrix;
  }
`

// Fragment shader program
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

function main () {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl')

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas)

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.')
    return
  }

  // Write the positions of vertices to a vertex shader
  const n = initVertexBuffers(gl)
  if (n < 0) {
    console.log('Failed to set the positions of the vertices')
    return
  }

  // The rotation angle
  const ANGLE = 120.0
  // Create a rotation matrix
  const radian = Math.PI * ANGLE / 180.0 // Convert to radians
  const cosB = Math.cos(radian), sinB = Math.sin(radian)

  // Note: WebGL is column major order
  const xformMatrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0,  0.0, 1.0, 0.0,
    0.0,  0.0, 0.0, 1.0
  ])

  // Pass the rotation matrix to the vertex shader
  const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix')
    return
  }

  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers (gl) {
  var vertices = new Float32Array([
    0.0,  0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])

  const n = 3 // The number of vertices

  // Create a buffer object
  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object')
    return -1
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position)

  return n
}

window.addEventListener('load', main)
