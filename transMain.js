  'use strict';

  // Global variables that are set and used
  // across the application
  let gl, program;
  let myCube;
  let myCylinder;
  let myCone;
  let mySphere;


  
  // Global declarations of objects that you will be drawing
  var myTeapot = null;


//
// A function that creates shapes to be drawn and creates a VAO for each
//
// We start you out with an example for the teapot.
//
function createShapes() {

    myTeapot = new Teapot();
    myTeapot.VAO = bindVAO (myTeapot);
    myCube = new Cube(3);
    myCube.VAO = bindVAO(myCube); 
    myCylinder = new Cylinder(20, 10);
    myCylinder.VAO = bindVAO(myCylinder);
    myCone = new Cone(20, 10);
    myCone.VAO = bindVAO(myCone);
    mySphere = new Sphere(20, 20);
    mySphere.VAO = bindVAO(mySphere);
}


//
// Set up your camera and your projection matrices
//
function setUpCamera() {
  let projMatrix = glMatrix.mat4.create();
  let fovy = glMatrix.glMatrix.toRadian(60);
  let aspect = 1;
  let near = 0.1;
  let far = 100.0;
  glMatrix.mat4.perspective(projMatrix, fovy, aspect, near, far);
  gl.uniformMatrix4fv(program.uProjT, false, projMatrix);
  let viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(
    viewMatrix,
    [0, 4, 10],   // eye: raised Y and pulled back Z
    [0, 0, 0],    // center: looking at origin
    [0, 1, 0]     // up vector
  );

  gl.uniformMatrix4fv(program.uViewT, false, viewMatrix);
}






//
// Use this function to draw all of your shapes.
// Recall that VAOs should have been set up the call to createShapes()
// You'll have to provide a Model Matrix for each shape to be drawn that
// places the object in the world.
//
// An example is shown for placing the teapot
//
function drawShapes() {
  const pedestalPositions = [-3, 0, 3]; // x positions: left, center, right

  pedestalPositions.forEach((x, idx) => {
    const pedestalMatrix = glMatrix.mat4.create();

    // -- Draw pedestal base cube
    glMatrix.mat4.translate(pedestalMatrix, pedestalMatrix, [x, -1.0, 0]);
    glMatrix.mat4.scale(pedestalMatrix, pedestalMatrix, [2.0, 0.4, 2.0]);
    gl.uniformMatrix4fv(program.uModelT, false, pedestalMatrix);
    gl.bindVertexArray(myCube.VAO);
    gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);

    // -- Draw pedestal column (cylinder)
    const columnMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(columnMatrix, columnMatrix, [x, 0.0, 0]);
    glMatrix.mat4.rotateX(columnMatrix, columnMatrix, radians(90));
    glMatrix.mat4.scale(columnMatrix, columnMatrix, [1.5, 0.95, 1.75]);
    gl.uniformMatrix4fv(program.uModelT, false, columnMatrix);
    gl.bindVertexArray(myCylinder.VAO);
    gl.drawElements(gl.TRIANGLES, myCylinder.indices.length, gl.UNSIGNED_SHORT, 0);


    // -- Draw pedestal top cube
    const topMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(topMatrix, topMatrix, [x, 1.2, 0]);
    glMatrix.mat4.scale(topMatrix, topMatrix, [2.0, 0.4, 2.0]);
    gl.uniformMatrix4fv(program.uModelT, false, topMatrix);
    gl.bindVertexArray(myCube.VAO);
    gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
  });

  // === Sphere on left pedestal ===
  let sphereMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(sphereMatrix, sphereMatrix, [-3, 2.0, 0]); // slightly raised to sit nicely
  glMatrix.mat4.scale(sphereMatrix, sphereMatrix, [1.3, 1.3, 1.3]); // increase the size
  glMatrix.mat4.rotateX(sphereMatrix, sphereMatrix, radians(90.0));
  gl.uniformMatrix4fv(program.uModelT, false, sphereMatrix);
  gl.bindVertexArray(mySphere.VAO);
  gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);

  // === Teapot on center pedestal ===
  let teapotMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(teapotMatrix, teapotMatrix, [0.0, 1.5, 0.0]);
  glMatrix.mat4.scale(teapotMatrix, teapotMatrix, [0.85, 0.85, 0.85]); // increase the size
  glMatrix.mat4.rotateY(teapotMatrix, teapotMatrix, radians(180.0));
  gl.uniformMatrix4fv(program.uModelT, false, teapotMatrix);
  gl.bindVertexArray(myTeapot.VAO);
  gl.drawElements(gl.TRIANGLES, myTeapot.indices.length, gl.UNSIGNED_SHORT, 0);

  // === Cone on right pedestal ===
  let coneMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(coneMatrix, coneMatrix, [3, 2.0, 0]); // raise cone so it sits visibly
  glMatrix.mat4.scale(coneMatrix, coneMatrix, [1.3, 1.3, 1.3]); // stretch vertically to show cone shape
  glMatrix.mat4.rotateX(coneMatrix, coneMatrix, radians(-90)); // make it point upward
  gl.uniformMatrix4fv(program.uModelT, false, coneMatrix);
  gl.bindVertexArray(myCone.VAO);
  gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);
}




///////////////////////////////////////////////////////////////////
//
//   You shouldn't have to edit below this line
//
///////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram() {
    const vertexShader = getShader('vertex-shader');
    const fragmentShader = getShader('fragment-shader');

    // Create a program
    program = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      let myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
    
  }

  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }


    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initProgram();
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera();
    
    // do a draw
    draw();
  }
