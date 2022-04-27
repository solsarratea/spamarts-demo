void main() {
  vec3 color; vec2 pos = uv;  vec3 video = getCam(pos);

  vec2 posN = (pos * 0.5) + vec2(0.5);
  color = mix(video,getPrevious(uv+0.01*vec2(cos(time),sin(time))),bpm(20.,1.,1.));
  color.r = mix(color,getPrevious(uv*0.9),bpm(2.,1.,1.)).r;
  color.g = mix(color,getPrevious(uv+0.05*floor(uv*100.)/100.),bpm(1.,1.,1.)).g;
  color = mix(color.grb, video,step(0.7,luma(video)));
  color += getCam(uv)*0.001;

  gl_FragColor = vec4(color, 1);
}
