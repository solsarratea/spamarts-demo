void main() {
  vec3 color;  vec2 uvN = (uv * 0.5) + vec2(0.5);

  vec3 video = getCam(uv);

 gl_FragColor = vec4(video, 1);
}