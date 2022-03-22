const regl = require("regl")();
const { setupWebcam } = require("./src/camera.js");
require("./src/fade.js");
require("./src/reference.js");
let fs = require("fs");
let prefix = fs.readFileSync(__dirname + "/src/prefix.glsl").toString();

////////////////////////////////////////////////////////////////////////
/// EDITOR
const Editor = require("./src/editor.js");
var editor = new Editor();
window.editor=editor;

const showEditor = document.getElementById("show-editor");
showEditor.addEventListener("click", () => {
    {window.editor.isShowing ? window.editor.hide() : window.editor.show() }
});

/// Content
let demos = fs.readdirSync(__dirname + "/demos");
let previousDemo = document.getElementById("prev");
let nextDemo = document.getElementById("next");
let demoIndex = demos.indexOf("init.glsl");
previousDemo.addEventListener("click", () => {
  demoIndex = (demoIndex + demos.length - 1) % demos.length;
  replaceShader();
});
nextDemo.addEventListener("click", () => {
  demoIndex = (demoIndex + 1) % demos.length;
  replaceShader();
});

function replaceShader() {
  let file = demos[demoIndex];
  fetch("./demos/" + file)
    .then(response => {
      return response.text();
    })
    .then(data => {
      editor.setValue(data);
    });
}

replaceShader();

/// Handlers
let shaders = require("./src/pack.shader.js");
shaders.fragment = shaders.fragment.replace(
    `#define GLSLIFY 1
  `,
    ""
  );
  let knownGoodShader = shaders.fragment;
  let prefixLength = prefix.split(/\r\n|\r|\n/).length - 1;
  let widgets = [];
  let markers = [];
  
  function clearHints(errors) {
    editor.cm.operation(function() {
      for (var i = 0; i < widgets.length; ++i) {
        editor.cm.removeLineWidget(widgets[i]);
      }
      widgets.length = 0;
  
      for (var i = 0; i < markers.length; ++i) {
        markers[i].clear();
      }
      markers.length = 0;
    });
  }
  
  function displayError(line, offset, message, token) {
    line = line - prefixLength;
    var msg = document.createElement("div");
    if (widgets.some(widget => widget["_line_number"] == line)) {
      return;
    }
    msg.appendChild(
      document.createTextNode(
        ("^" + message).padStart(offset + message.length + 1, "\xa0")
      )
    );
    msg.className = "lint-error fade";
    let lineWidget = editor.cm.addLineWidget(line - 1, msg, {
      coverGutter: false,
      noHScroll: true
    });
    lineWidget["_line_number"] = line;
    widgets.push(lineWidget);
    markers.push(
      editor.cm.markText(
        { line: line - 1, ch: offset },
        { line: line - 1, ch: offset + token.length },
        { className: "cm-custom-error", attributes: { alt: message } }
      )
    );
  }
  // this relies on a special forked regl.
  window.shader_error_hook = displayError;
  editor.setValue(shaders.fragment);
  
  editor.cm.on("change", c => {
    let newShader = editor.getValue();
    shaders.fragment = newShader;
    clearHints();
  });
  

//////////////////////////////////////////////////////////////////////////////
///CONTROLS
var Tweakpane  = require("tweakpane/dist/tweakpane.min.js");
const { isNumber } = require("@tensorflow/tfjs-core/dist/util");
  const pane = new Tweakpane.Pane();



//////////////////////////////////////////////////////////////////////////////
/////Set  GRANULATOR

const lastFrame = regl.texture();

const initWebcam = (deviceId) => setupWebcam({
  deviceId,
  regl,
  done: (webcam,{ videoWidth, videoHeight}) => {
    let drawTriangle = regl({
        uniforms: {
        tick: ({tick}) => tick % 10000,
        camTex: webcam,
        previousTex: lastFrame,
        videoResolution: [videoWidth, videoHeight],
        time: ({ time }) => time % 10000,
      
        resolution: ({ viewportWidth, viewportHeight }) => [
          viewportWidth,
          viewportHeight
        ],
        targetAspect: () => window.innerWidth / window.innerHeight,
        scaledVideoResolution: ({ viewportWidth: vW, viewportHeight: vH }) => {
          let i;
          i =
            vW / vH > videoWidth / videoHeight
              ? [videoWidth * (vH / videoHeight), vH]
              : [vW, videoHeight * (vW / videoWidth)];
          return i;
        }
       },

      frag: () =>  prefix + shaders.fragment,
      vert: () => shaders.vertex,
      attributes: {
        position: [
          [-1, 4],
          [-1, -1],
          [4, -1]
        ]
      },
      count: 3
    });

      regl.frame(function(context) {
        try {
          drawTriangle();
        } catch (e) {
          shaders.fragment = knownGoodShader;

          return;
        }

        knownGoodShader = shaders.fragment;

        lastFrame({
          copy: true
        });

      });
    }
});

//////////////////////////////////////////////////////////////////////////////
/////Set up CAMERA

window.webcams = [];
navigator.mediaDevices.enumerateDevices().then((devices) => {
    var webcams = [];
    devices.forEach((device)=>{
        if(device.kind === 'videoinput'){
            webcams.push(device)
        }
    })
    window.webcams = webcams;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log("all devices", webcams)

    var cam = parseInt(urlParams.get('cam'))
    if (isNaN(cam)){
      cam = 0;
    }
    console.log("selected device: ", webcams[cam].deviceId, cam)
    initWebcam(webcams[cam].deviceId)


})