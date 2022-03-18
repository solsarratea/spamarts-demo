void main() {
  vec2 pos = uv; vec3 color;
   vec2 uvN = (uv * 0.5) + vec2(0.5);
  
  vec3 video = getCam(uv); 
  pos = rotate(pos,0.0001);
  pos *=0.999;
  
  vec2 offset = cos(rotate(pos*vec2(100.*rand(pos.x),2.),time*.0002))*0.004*length(pos);
  color= mix(video,getPrevious(pos+offset),step(0.+min(tan(time*2.)*.9,0.5),luma(video)));

  vec3 srcDif = video-getPrevious(uv);
  color +=0.01*srcDif;
  
  gl_FragColor = vec4(color,1.);
}