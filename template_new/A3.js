/**
 * UBC CPSC 314 (2016_W1)
 * Assignment 3
 */

// CREATE SCENE
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xcdcdcd);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(25.0,(window.innerWidth/window.innerHeight), 0.1, 10000);
camera.position.set(0.0,15.0,40.0);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();


//ROCKS TEXTURE 
var rocksTexture =  {type: "t", value:  THREE.ImageUtils.loadTexture('images/lava-texture.jpg')} ; // I had to modify this to match the slides...

//LIGHTING PROPERTIES
var lightColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};
var ambientColor = {type: "c", value: new THREE.Color(0.4,0.4,0.4)};
var lightDirection = {type: "v3", value: new THREE.Vector3(0.49,0.79,0.49)};

var default_direction = new THREE.Vector3(0.49,0.79,0.49);

var white_color = new THREE.Color(1.0,1.0,1.0); // default light color for resetting purposes.
var offwhite_color = new THREE.Color(0.4,0.4,0.4); // default ambient color 


//MATERIAL PROPERTIES 
var kAmbient = {type: "f", value: 0.4 };
var kDiffuse = {type: "f", value: 0.8 };
var kSpecular = {type: "f", value: 0.8 };
var shininess = {type: "f", value: 10.0 };

var default_ambient = 0.4;
var default_diffuse = 0.8;
var default_specular = 0.8;
var default_shine = 10.0;

var baseColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};

var cubeCamera = new THREE.CubeCamera(1,1000, 256);
cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
cubeCamera.position.copy(camera.position);
scene.add(cubeCamera);

var cubeCameraTex = {type: "t", value: cubeCamera.renderTarget};


// SHADER MATERIALS (Remember to change this, in order to use uniform variables.)
var gouraudMaterial = new THREE.ShaderMaterial({
  uniforms: { kAmbient, kDiffuse, kSpecular, shininess, lightColor, ambientColor, lightDirection, baseColor, 
    cubemapTex: cubeCameraTex, }
});
var phongMaterial = new THREE.ShaderMaterial({
  uniforms: { kAmbient, kDiffuse, kSpecular, shininess, lightColor, ambientColor, lightDirection, baseColor,
  cubemapTex: cubeCameraTex, }
});
var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms: { kAmbient, kDiffuse, kSpecular, shininess, lightColor, ambientColor, lightDirection, baseColor,
  cubemapTex: cubeCameraTex, }
});
var textureMaterial = new THREE.ShaderMaterial({
  uniforms: { kAmbient, kDiffuse, kSpecular, shininess, lightColor, ambientColor, lightDirection, baseColor, 
    texture: rocksTexture, isFloor: {type: "i", value: 0 }, cubemapTex: cubeCameraTex,}});

// FLOOR 
var floorTexture = {type: "t", value: THREE.ImageUtils.loadTexture('images/checkerboard.jpg')};
floorTexture.value.wrapS = floorTexture.value.wrapT = THREE.RepeatWrapping;
floorTexture.value.repeat.set(4,4);

var floorMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: { kAmbient, kDiffuse, kSpecular, shininess, lightColor, ambientColor, lightDirection, baseColor, texture:floorTexture, 
    isFloor: {type: "i", value: 1 }, cubemapTex: cubeCamera.renderTarget.texture,}
 });

var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(30.0, 30.0), floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// LOAD SHADERS
var shaderFiles = [
  'glsl/gouraud.fs.glsl','glsl/gouraud.vs.glsl',
  'glsl/phong.vs.glsl','glsl/phong.fs.glsl',
  'glsl/blinnPhong.vs.glsl','glsl/blinnPhong.fs.glsl',
  'glsl/texture.fs.glsl','glsl/texture.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
 gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
 gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
 phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
 phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
 blinnPhongMaterial.vertexShader = shaders['glsl/blinnPhong.vs.glsl'];
 blinnPhongMaterial.fragmentShader = shaders['glsl/blinnPhong.fs.glsl'];
 textureMaterial.fragmentShader = shaders['glsl/texture.fs.glsl'];
 textureMaterial.vertexShader = shaders['glsl/texture.vs.glsl'];
 floorMaterial.fragmentShader = shaders['glsl/texture.fs.glsl'];
 floorMaterial.vertexShader = shaders['glsl/texture.vs.glsl'];
})

// CREATE SPHERES
var sphereRadius = 2.0;
var sphere = new THREE.SphereGeometry(sphereRadius, 16, 16);

var gouraudSphere = new THREE.Mesh(sphere, gouraudMaterial); 
gouraudSphere.position.set(-7.5, sphereRadius, 0);
scene.add(gouraudSphere);

var phongSphere = new THREE.Mesh(sphere, phongMaterial); 
phongSphere.position.set(-2.5, sphereRadius, 0);
scene.add(phongSphere);

var blinnPhongSphere = new THREE.Mesh(sphere, blinnPhongMaterial); 
blinnPhongSphere.position.set(2.5, sphereRadius, 0);
scene.add(blinnPhongSphere);

var textureSphere = new THREE.Mesh(sphere, textureMaterial); 
textureSphere.position.set(7.5, sphereRadius, 0);
scene.add(textureSphere);

var keyboard = new THREEx.KeyboardState();

// SETUP UPDATE CALL-BACK
var render = function() {
  checkKeyboard();
	textureMaterial.needsUpdate = true;
	phongMaterial.needsUpdate = true;
	blinnPhongMaterial.needsUpdate = true;
	gouraudMaterial.needsUpdate = true;
  floorMaterial.needsUpdate = true;

	requestAnimationFrame(render);
  cubeCamera.updateCubeMap(renderer, scene);
	renderer.render(scene, camera);
}

var random = function(x,y) {
  return Math.floor(Math.random() * (y - x + 1) + x);
}

var reset = function() {
  kAmbient.value = default_ambient;
  kDiffuse.value = default_diffuse;
  kSpecular.value = default_specular;
  shininess.value = default_shine;
  lightColor.value = white_color;
  baseColor.value = white_color;
  lightDirection.value = default_direction;
  ambientColor.value = offwhite_color;

}

var last_press;
var color_to_keep;

var checkKeyboard = function() {

  if (keyboard.pressed('l')) { // change light color- change both lightColor and ambientColor
    color_to_keep = random(1,3); // randomly generate which color to keep at 1.0, to maintain light intensity!
    var componentOne = Math.random(); // generate one of two random colors to swap
    var componentTwo = Math.random(); // same
    if (color_to_keep == 1) {
      lightColor.value = new THREE.Color(1.0, componentOne, componentTwo);
      ambientColor.value = new THREE.Color(0.4, 0.4 * componentOne, 0.4 * componentTwo);
    } else if (color_to_keep == 2) {
      lightColor.value = new THREE.Color(componentOne, 1.0, componentTwo);
      ambientColor.value = new THREE.Color(0.4 * componentOne, 0.4, 0.4 * componentTwo);
    } else if (color_to_keep == 3) {
      lightColor.value = new THREE.Color(componentOne, componentTwo, 1.0);
      ambientColor.value = new THREE.Color(0.4 * componentOne, 0.4 * componentTwo, 0.4);
    }
  }
  if (keyboard.pressed('m')) { // change base color
    color_to_keep = random(1,3);
    if (color_to_keep == 1) {
      baseColor.value = new THREE.Color(1.0, Math.random(), Math.random());
    } else if (color_to_keep == 2) {
      baseColor.value = new THREE.Color(Math.random(), 1.0, Math.random());
    } else if (color_to_keep == 3) {
      baseColor.value = new THREE.Color(Math.random(), Math.random(), 1.0);
    }
  }

  if (keyboard.pressed('a')) { // randomly change ambient
    kAmbient.value = Math.random() / 2.0; // we divide by 2 so we keep kA = kD / 2, at least... on average
  }

  if (keyboard.pressed('d')) { // randomly change diffuse
    kDiffuse.value = Math.random();
  }

  if (keyboard.pressed('s')) { // randomly change specular
    kSpecular.value = Math.max(Math.random(), kDiffuse.value);
  }

  if (keyboard.pressed('z')) {
    kAmbient.value = Math.random() / 2.0;
    kDiffuse.value = kAmbient.value * 2.0;
    kSpecular.value = Math.max(Math.random(), kDiffuse.value);
  }

  if (keyboard.pressed('q')) { // randomly change direction of light
    lightDirection.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());
  }

  if (keyboard.pressed('r')) { // base reset function
    reset();
  }
}

render();