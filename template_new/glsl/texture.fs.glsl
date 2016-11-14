// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec2 texCoord;
uniform sampler2D texture;

varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;

// material properties
uniform float kAmbient; // kA
uniform float kDiffuse; // kD
uniform float kSpecular; // kS
uniform float shininess; // Ns

// light properties
uniform vec3 lightColor; // Il
uniform vec3 ambientColor; // Il (ambient)
uniform vec3 lightDirection;

uniform vec3 baseColor;

// from our vertex shader

varying vec3 view_normal; // v
varying vec3 vertex_normal; // n

uniform int isFloor;
void main() {

	vec4 texColor = texture2D(texture, texCoord);

	if (isFloor != 1) {
		texColor *= vec4(baseColor, 1.0);
	}
	
	// basically the same as in gouraud.vs, except our v and n are already computed
	vec3 light_normal = normalize(lightDirection); // l
	vec4 diffuse = vec4(0.0,0.0,0.0,0.0);
	if (dot(vertex_normal, light_normal) > 0.0) {
		diffuse = vec4((kDiffuse * lightColor * dot(vertex_normal, light_normal)), 1.0) * texColor; // Id = kD * Il * (n dot l)
	} // otherwise it's just the zero vector, in the case of total internal reflection...

	vec3 reflection = reflect(-light_normal, vertex_normal);
	vec3 reflection_normal = normalize(reflection); // r
	vec3 half_vector = normalize((view_normal + light_normal)/2.0); // v + l

	vec4 specular = vec4(0.0,0.0,0.0,0.0);

	if ((dot(view_normal, reflection_normal) > 0.0)||(shininess == 0.0)) {
		specular = vec4(kSpecular * lightColor * pow(dot(vertex_normal, half_vector), shininess), 1.0); 
		// Is = kS * Il * (n dot h)^Ns
		// Blinn-Phong uses the Half vector H in this case
	} 
	vec4 ambient = (kAmbient * ambientColor, 1.0) * texColor; // Ia = Il * kA

	gl_FragColor = vec4(ambient + diffuse + specular); // add 'em up! we're done!!!

}
