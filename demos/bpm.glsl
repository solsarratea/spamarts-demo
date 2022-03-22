void main() {
  vec3 color;  vec2 uvN = (uv * 0.5) + vec2(0.5);

  vec3 video = getCam(uv);
  
  color =  video;
  vec2 offset = vec2(0.,0.001*bpm(120.,1.,.5));
 offset.x+= 0.001*(1.-bpm(120.,1.,.5));
  float scale = 1.+bpm(120.,1.,mix(-.1,0.005,bpm(120.,1.,1.)));
   color =mix(color,RGBsplit(0.001),step(bpm(120.,1.,.5),luma(video)))*1.05;
  color = mix(color, getPrevious(uv*scale+offset),step(bpm(120.,1.,.8),luma(video))*1.002);

 gl_FragColor = vec4(color, 1);
}