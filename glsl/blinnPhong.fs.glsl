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

// from our vertex shader

varying vec3 view_normal; // v
varying vec3 vertex_normal; // n

varying vec3 angle;
uniform samplerCube cubemapTex;

uniform vec3 baseColor;

void main() {

	// basically the same as in gouraud.vs, except our v and n are already computed
	vec3 light_normal = normalize(lightDirection); // l
	vec3 diffuse = vec3(0.0,0.0,0.0);
	if (dot(vertex_normal, light_normal) > 0.0) {
		diffuse = kDiffuse * lightColor * dot(vertex_normal, light_normal) * baseColor; // Id = kD * Il * (n dot l)
	} // otherwise it's just the zero vector, in the case of total internal reflection...

	vec3 reflection = reflect(-light_normal, vertex_normal);
	vec3 reflection_normal = normalize(reflection); // r
	vec3 half_vector = normalize((view_normal + light_normal)/2.0); // (v + l)/2

	vec3 specular = vec3(0.0,0.0,0.0);

	if ((dot(view_normal, reflection_normal) > 0.0)||(shininess == 0.0)) {
		specular = kSpecular * lightColor * pow(dot(vertex_normal, half_vector), shininess); 
		// Is = kS * Il * (n dot h)^Ns
		// Blinn-Phong uses the Half vector H in this case
	} 
	vec3 ambient = kAmbient * ambientColor * baseColor; // Ia = Il * kA
	vec4 tex_color = textureCube(cubemapTex, angle);

	gl_FragColor = tex_color * vec4(ambient + diffuse + specular, 1.0); // add 'em up! we're done!!!
}