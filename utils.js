/**
 * Initialize and get the rendering for WebGL
 * @param canvas <cavnas> element
 * @return the rendering context for WebGL
 */
function getWebGLContext (canvas) {
  // Get the rendering context for WebGL
  const gl = canvas.getContext('webgl')
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL. Your browser or machine may not support it.')
    return null
  }
  return gl
}

/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
function initShaders (gl, vshader, fshader) {
  const program = gl.createProgram()
  if (!program) {
    console.log('Failed to create program')
    return null
  }

  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)
  if (!vertexShader || !fragmentShader) {
    return null
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // Link the program object
  gl.linkProgram(program)
  gl.useProgram(program)
  gl.program = program

  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    var error = gl.getProgramInfoLog(program)
    console.log('Failed to link program: ' + error)
    gl.deleteProgram(program)
    return null
  }

  return true
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader (gl, type, source) {
  // Create shader object
  const shader = gl.createShader(type)
  if (shader == null) {
    console.log('unable to create shader')
    return null
  }

  // Set the shader program
  gl.shaderSource(shader, source)

  // Compile the shader
  gl.compileShader(shader)

  // Check the result of compilation
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader)
    console.log('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}
