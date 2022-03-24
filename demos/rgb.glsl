void main() {
  vec3 color; vec2 pos = uv; 
  vec2 posN = (pos * 0.5) + vec2(0.5);

  color = getCam(pos);
  
  color = mix(color, getPrevious(uv),bpm(10.,1.,1.)).rgb;
  
  //color.r = mix(color, getPrevious(uv),bpm(30.,1.,1.)).r;
  color.b = mix(color, getPrevious(uv),bpm(60.,1.,1.)).b;
  color.g = mix(color, getPrevious(uv),bpm(120.,1.,1.)).g;
  
  color = mix(color, getPrevious(uv*0.99+0.001), step(0.9,luma(getCam(uv))));

 gl_FragColor = vec4(color, 1);
}
