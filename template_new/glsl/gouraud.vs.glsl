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

void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE

	// get all our normals out, boys
	vec3 light_normal = normalize(lightDirection); // l
	vec3 vertex_normal = normalize(normalMatrix * normal); // n
	vec3 diffuse = vec3(0.0,0.0,0.0);
	if (dot(vertex_normal, light_normal) > 0.0) {
		diffuse = kDiffuse * lightColor * dot(vertex_normal, light_normal) * baseColor; // Id = kD * Il * (n dot l)
	} // otherwise it's just the zero vector, in the case of total internal reflection...

	vec3 reflection = reflect(-light_normal, vertex_normal);
	vec3 reflection_normal = normalize(reflection); // r
	vec3 view_normal = normalize(vec3(projectionMatrix *  modelViewMatrix * vec4(position, 1.0))); // v
	// literally just the below gl_position but normalized
	
	vec3 specular = vec3(0.0,0.0,0.0);

	if ((dot(view_normal, reflection_normal) > 0.0)||(shininess == 0.0)) {
		specular = kSpecular * lightColor * pow(dot(view_normal, reflection_normal), shininess); 
		// Is = kS * Il * (v dot r)^Ns
	} // the additional "shininess == 0" clause is b/c even if our dot product is 0 or < 0, it's 1 if its exponent is 0
	// otherwise it's a zero vector because, again, total internal reflection etc.

	vec3 ambient = kAmbient * ambientColor * baseColor; // Ia = Il * kA

	V_Color = vec4(ambient + diffuse + specular, 1.0); // add 'em up! we're done!!!

	// Position
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}