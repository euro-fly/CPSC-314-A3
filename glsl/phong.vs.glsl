varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;

varying vec3 view_normal;
varying vec3 vertex_normal;

// material properties
uniform float kAmbient; // kA
uniform float kDiffuse; // kD
uniform float kSpecular; // kS
uniform float shininess; // Ns

// light properties
uniform vec3 lightColor; // Il
uniform vec3 ambientColor; // Il (ambient)
uniform vec3 lightDirection;

varying vec3 my_normal;
varying float distance_camera;

void main() {

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS
	V_Normal_VCS = vec4(normal, 1.0);
	V_ViewPosition = vec4(position, 1.0);

	view_normal = normalize(vec3(projectionMatrix *  modelViewMatrix * V_ViewPosition));
	vertex_normal = normalize(normalMatrix * vec3(V_Normal_VCS));
	my_normal = normal;

	

	gl_Position = projectionMatrix *  modelViewMatrix * V_ViewPosition;

	distance_camera = gl_Position.w;
}