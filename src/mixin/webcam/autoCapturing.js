import comm from "../common";

export function autoCapture(self) {
  console.log("⭐autoCapture");
  const faceapi = self.$store.state.faceapi;
  const ml5 = self.$store.state.ml5;

  console.log('⭐⭐⭐faceapi', faceapi.nets.tinyFaceDetector)

  let classifier = null;

  let realWidth = self.width_1280;
  let realHeight = realWidth * self.ID_type_Rate;
  let iOS = self.$store.state.is_iOS;
  if (iOS === false) 
    if(faceapi)
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ])
      .then(objectTracker(self))
      .catch((e) => console.error(e));
  
  function objectTracker(self) {
    console.log("✔️objectTracker");
    const queryImage = self.$store.state.queryImage;

    if (self.video) {
      let tracking = function() {
        if (self.stepType === "id")
          //Object tarcking
          classifier = ml5.objectDetector("cocossd", modelReady);
        if (self.stepType === "face") faceTracking(self, queryImage); //face tracking
      };
      if (self.resIdentityDocumentDetect === true) {
        stopVideo();
        self.video.removeEventListener("play", tracking);
      } else {
        self.video.addEventListener("play", tracking, false);
      }
    } else {
      throw new Error("⛔ Not initialized video object yet.");
    }
  }
  function modelReady() {
    // Change the status of the model once its ready
    self.status = "Model Loaded";
    self.video.crossOrigin = "anonymous";
    // Call the classifyVideo function to start classifying the video
    setTimeout(function() {
      classifyVideo();
    }, 500);
  }
  function classifyVideo() {
    if(self.sign.capture) {
      console.log("✔️Automatic detection shutdown!")
      return
    }
    try {
      setTimeout(function() {
        if(classifier){
          classifier.detect(self.video, gotResult);

        }else{
          throw new Error('⛔ Not initalized classifier object yet.')
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }
  function gotResult(err, results) {   
    let edge = ['#edge1','#edge2','#edge3','#edge4']
    for(let e of edge){
      if(document.querySelector(e))
        document.querySelector(e).classList.remove('shake')
    }
    if(!results) return

    if (err) console.log("ERROR. ", err);
    // let c2 = "";
    // let ctx2 = "";
    if (self.$refs.canvas) {
      let c1 = self.$refs.canvas ? self.$refs.canvas : "";
      if (c1) {
        const ctx = c1.getContext("2d") ? c1.getContext("2d") : "";
        if (ctx) {
          if (self.stepType === "id")
            // ctx2.clearRect(0, 0, self.width_id, self.height_id);
          // Font options.
          // const font = "16px sans-serif";
          // ctx.font = font;
          // ctx.textBaseline = "top";
          ctx.drawImage(self.$refs.video, 0, 0, c1.width, c1.height);

          let width_id = self.width_id;
          let height_id = self.height_id;
          let w_rate = width_id / realWidth;
          let h_rate = height_id / realHeight;
          let min_x = width_id * self.x_rate_min;
          let max_x = width_id * self.x_rate_max;
          let min_y = height_id * self.y_rate_min;
          let max_y = height_id * self.y_rate_max;
          let min_w = width_id * self.min_width;
          let max_w = width_id * self.max_width;
          let min_h = height_id * self.min_height;
          let max_h = height_id * self.max_height;

          if (results) {
            // Drawing boundary box
            results.forEach(function(prediction) {
              // console.log(prediction)
              let x = Math.round(prediction.x * w_rate * 100) / 100;
              let y = Math.round(prediction.y * h_rate * 100) / 100;
              let w = Math.round(prediction.width * w_rate * 100) / 100;
              let h = Math.round(prediction.height * h_rate * 100) / 100;
              // const confidence = prediction.confidence
              // Draw the bounding box.
              if (self.stepType === "id") {
                // ctx2.strokeStyle = "#00FFFF";
                // ctx2.lineWidth = 2;
                // ctx2.strokeRect(x, y, w, h); // boundary box
                if (prediction.label === "person"){
                  self.$store.state.isPerson = true;
                }
                console.log(`${min_x} < ${x} < ${max_x}`)
                console.log(`${min_y} < ${y} < ${max_y}`)
                console.log(`${min_w} < ${w} < ${min_w}`)
                console.log(`${min_h} < ${h} < ${min_h}`)

                // Target area
                if (min_x < x && x < max_x) {
                  if (min_y < y && y < max_y) {
                    console.log('edge1')
                    document.querySelector('#edge1').classList.add('shake')
                    if (min_w < w && w < max_w) {
                      console.log('edge2')
                      document.querySelector('#edge2').classList.add('shake')
                      if (min_h < h && h < max_h) {
                        console.log('edge3,4')
                        document.querySelector('#edge3').classList.add('shake')
                        document.querySelector('#edge4').classList.add('shake')
                        setTimeout(() => {
                          // if(self.$store.state.isPerson === true && self.$store.state.isIdentityDocument === true ) {
                          console.log("Automatic capture success");
                          self.btn_flag = true;
                          self.sign.capture = true;
                          self.$store.state.isIdentityDocument = true;
                          self.resIdentityDocumentDetect = true;
                          // }
                          
                        }, 500);
                      }
                    }
                  }
                }                
                // console.log(comm.curry(comm.calcAverage())(prediction))
              }
            });
          }
          setTimeout(function() {
            classifyVideo();
          }, 500);
        }
      }
    }
  }
  function faceTracking(self, queryImage) {
    console.log("✔️faceTracking")
    // const faceWrap = document.querySelector('#face_wrap')
    const canvas = faceapi.createCanvasFromMedia(self.video);
    // faceWrap.append(canvas)

    //Preparing the overlay canvas
    const displaysize = { width: realWidth, height: realWidth };
    faceapi.matchDimensions(canvas, displaysize);

    let streamDetecting = setInterval(async function() {
      let faceObj = "";
      let bestMatch = "";

      if (self.stateFaceCheck === false || self.sign.capture === true) {
        stopVideo(streamDetecting);
      }
      // // boundingpoly location
      // for(let i=0; i< 4; i++)
      //     if(document.querySelector(`#map${i}`))
      //     document.querySelector(`#map${i}`).style.color = '#ffffff'

      faceObj = await faceapi
        .detectSingleFace(
          self.video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      // console.log('faceObj',faceObj)
      if (faceObj) {
        self.$store.state.isFace = true;
        bestMatch = await faceCompare(self, faceObj, queryImage);
        // console.log('bestMatch',bestMatch)
        if (bestMatch) {
          if (bestMatch.distance) {
            // statndard Threshold 50%
            if (Math.round(bestMatch.distance * 100) / 100 <= 0.5) {
              self.faceCompareFlag = true;
              targetEvent(self, faceObj, streamDetecting);
            } else {
              self.faceCompareFlag = false;
            }
            console.log(
              "face Match: statndard Threshold 50%, ",
              (1 - Math.round(bestMatch.distance * 100) / 100) * 100 +
                "% 일치, ",
              "결과: " + self.faceCompareFlag
            );
          } else {
            targetEvent(self, faceObj, streamDetecting);
            new Error("⛔ No Could not refer to matched distance.");
          }
        } else {
          targetEvent(self, faceObj, streamDetecting);
          new Error("⛔ Not found bestMatch object.");
        }
      } else {
        self.$store.state.isFace = false;
      }
    }, 500);
  }
  function targetEvent(self, faceObj, streamDetecting) {
    if (faceObj !== undefined)
      if (faceObj.detection)
        if (faceObj.alignedRect !== undefined)
          if (faceObj.alignedRect !== null)
            if (self.stepType === "face")
              // if(self.stepType === "id")
              // targetEvent_id(streamDetecting, canvas, faceObj.alignedRect.box, self)
              // else if(self.stepType === "face")
              targetEvent_face(streamDetecting, faceObj.alignedRect.box);
            else throw new Error("⛔ An occerred Error: No Step type");
  }

  function stopVideo(streamDetecting) {
    console.log("✔️stopVideo")
    if (streamDetecting)
      clearInterval(streamDetecting); // stop roof
    self.video.pause();
  }

  function targetEvent_face(streamDetecting, box) {
    let length = self.width_and_height_face;
    let min_x = (Math.round((length - box._width) * 100) / 100 / 2) * 0.5;
    let max_x = min_x * 3;
    let min_y = (Math.round((length - box._height) * 100) / 100 / 2) * 0.5;
    let max_y = min_y * 3;
    let min_w = (Math.round(length * 100) / 100) * 0.6;
    let max_w = (Math.round(length * 100) / 100) * 0.8;
    let min_h = min_w;
    let max_h = max_w;
    let x = Math.round(box._x);
    let y = Math.round(box._y);
    let w = Math.round(box._width);
    let h = Math.round(box._height);

    console.log(`${min_x} < ${x} < ${max_x}`);
    console.log(`${min_y} < ${y} < ${max_y}`);
    console.log(`${min_w} < ${w} < ${max_w}`);
    console.log(`${min_h} < ${h} < ${max_h}`);

    // Target area
    if (min_x < x && x < max_x) {
      if (min_y < y && y < max_y) {
        if (min_w < w && w < max_w) {
          if (min_h < h && h < max_h) {
            comm.stopStreamedVideo(self.$refs.video);
            console.log("Completed face recognition on the Face");
            self.btn_flag = true;
            self.resFaceDetect = true;
            clearInterval(streamDetecting);
          }
        }
      }
    }
  }
}

export async function faceCompare(self, faceObj, queryImage) {
  const faceapi = self.$store.state.faceapi;

  if (!queryImage) return;

  const singleResult = await faceapi
    .detectSingleFace(queryImage)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (singleResult) {
    const faceMatcher = new faceapi.FaceMatcher(faceObj);
    console.log(faceMatcher);
    const bestMatch = await faceMatcher.findBestMatch(singleResult.descriptor);

    return bestMatch;
  }
}
