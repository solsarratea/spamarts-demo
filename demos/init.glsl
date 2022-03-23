void main() {
  vec3 color; vec2 pos = uv; 
  vec2 posN = (pos * 0.5) + vec2(0.5);

  color = getCam(pos);

 gl_FragColor = vec4(color, 1);
}