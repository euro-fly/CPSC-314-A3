varying vec4 V_Color;

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

uniform samplerCube cubemapTex;


void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE

	// get all our normals out, boys
	vec3 light_normal = normalize(lightDirection); // l
	vec3 vertex_normal = normalize(normalMatrix * normal); // n
	vec4 diffuse = vec4(0.0,0.0,0.0,0.0);


	vec3 angle = normalize(vec3(vertex_normal - cameraPosition));

	vec4 tex_color = textureCube(cubemapTex, angle);

	if (dot(vertex_normal, light_normal) > 0.0) {
		diffuse = vec4(kDiffuse * lightColor * dot(vertex_normal, light_normal) * baseColor, 1.0); // Id = kD * Il * (n dot l)
	} // otherwise it's just the zero vector, in the case of total internal reflection...

	vec3 reflection = reflect(-light_normal, vertex_normal);
	vec3 reflection_normal = normalize(reflection); // r
	vec3 view_normal = normalize(vec3(projectionMatrix *  modelViewMatrix * vec4(position, 1.0))); // v
	// literally just the below gl_position but normalized
	
	vec4 specular = vec4(0.0,0.0,0.0,0.0);

	if ((dot(view_normal, reflection_normal) > 0.0)||(shininess == 0.0)) {
		specular = vec4(kSpecular * lightColor * pow(dot(view_normal, reflection_normal), shininess),1.0); 
		// Is = kS * Il * (v dot r)^Ns
	} // the additional "shininess == 0" clause is b/c even if our dot product is 0 or < 0, it's 1 if its exponent is 0
	// otherwise it's a zero vector because, again, total internal reflection etc.

	vec4 ambient = vec4(kAmbient * ambientColor * baseColor, 1.0); // Ia = Il * kA


	V_Color = tex_color * vec4(ambient + diffuse + specular); // add 'em up! we're done!!!

	// Position
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}