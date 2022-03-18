function ShaderContent(demos, demoIndex){
    this.demos = demos;
    this.demoIndex = demoIndex;
   

    let previousDemo = document.getElementById("prev");
    let nextDemo = document.getElementById("next");

    const replaceShader = () => previousDemo.addEventListener("click", () => {
        demoIndex = (demoIndex + demos.length - 1) % demos.length;
        replaceShader();
      });
      nextDemo.addEventListener("click", () => {
        demoIndex = (demoIndex + 1) % demos.length;
        replaceShader();
      });

      previousDemo.addEventListener("click", () => {
        demoIndex = (demoIndex + demos.length - 1) % demos.length;
        replaceShader();
      });
      nextDemo.addEventListener("click", () => {
        demoIndex = (demoIndex + 1) % demos.length;
        replaceShader();
      });
    
      replaceShader();
}

  module.exports = ShaderContent ;