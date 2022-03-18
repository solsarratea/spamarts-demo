let loader = document.getElementById("loading");
let video = null;

function setupWebcam(options) {
    const regl = options.regl;
    const deviceId= options.deviceId;
   
  function startup() {
    video = document.getElementById("video");

    function tryGetUserMedia() {
      navigator.mediaDevices
        // .getDisplayMedia({
        .getUserMedia({
            video: { deviceId: {exact: deviceId }},
            audio: false
        })
        .then(gumSuccess)
        .catch(e => {
          console.log("initial gum failed");
        });
        //video.play();
    }

    tryGetUserMedia();

    function gumSuccess(stream) {
      loader.innerText = "";
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL && window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = function() {
        const webcam = regl.texture(video);
       
        const { videoWidth, videoHeight } = video;

        var w = window.innerWidth;
        var h = window.innerHeight;
        video.height = h;
        video.width = w;


          regl.frame(() => {
              if (!window.snap){
                  webcam.subimage(video)
              }
          })


        options.done(webcam, {
          videoWidth,
          videoHeight,
        });
      };
    }
     function adjustVideoProportions() {
       // resize overlay and video if proportions of video are not 4:3
       // keep same height, just change width
       debugger
       var proportion = video.videoWidth/video.videoHeight;
        video_width = Math.round(video_height * proportion);
       video.width = video_width;
    }
    video.onresize = function() {
       //  adjustVideoProportions();
    };
    video.addEventListener(
      "canplay",
      function(ev) {
        video.play();
      },
      false
    );
  }

  window.onload = startup;
}



module.exports = { setupWebcam };
