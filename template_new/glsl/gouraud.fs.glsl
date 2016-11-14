varying vec4 V_Color;

uniform samplerCube cubemapTex;


void main() {
	gl_FragColor = V_Color;
	// it's gouraud lighting. no need to modify this... I think?
}