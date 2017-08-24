// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
  }
`

// Fragment shader program
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

// Rotation angle (degrees/second)
let ANGLE_STEP = 45.0

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

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1)

  // Get storage location of u_ModelMatrix
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix')
    return
  }

  // Current rotation angle
  let currentAngle = 0.0
  // Model matrix
  const modelMatrix = new Matrix4()

  // Start drawing
  const tick = function () {
    currentAngle = animate(currentAngle)  // Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)   // Draw the triangle
    requestAnimationFrame(tick, canvas)   // Request that the browser ?calls tick
  }
  tick()
}

function initVertexBuffers (gl) {
  var vertices = new Float32Array([
    0.0, 0.5,
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

function draw (gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1)
  modelMatrix.translate(0.35, 0, 0)

  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

// Last time that this function was called
let g_last = Date.now()
function animate (angle) {
  // Calculate the elapsed time
  const now = Date.now()
  let elapsed = now - g_last
  g_last = now
  // Update the current rotation angle (adjusted by the elapsed time)
  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
  return newAngle %= 360
}

function up () {
  ANGLE_STEP += 10
}

function down () {
  ANGLE_STEP -= 10
}

window.addEventListener('load', main)
document.getElementById('up').addEventListener('click', up);
document.getElementById('down').addEventListener('click', down);
