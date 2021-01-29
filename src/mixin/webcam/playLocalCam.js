import { faceCompare } from "./autoCapturing";
import comm from "../common"
export function playLocalCam(self) {
  console.log("⭐⭐playLocalCam");
  self.uiflag.localCam = true;
  let ver = self.$store.state.ver;

  let faceapi = self.$store.state.faceapi;
  self.stepType === "id" && playLocalCam_id();
  self.stepType === "face" &&
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    ])
      .then(playLocalCam_face())
      .catch((e) => console.error(e));

  function playLocalCam_id() {
    console.log("✔️playLocalCam_id");
    let localCam = self.$refs.localCam;
    let canvas = self.$refs.canvas;

    if(self.$store.state.type === "passport") {
      self.license_img = require('../../img/license_img_pspt.png')
      self.uiflag.passport = false
    }
    self.onLocalcam()

    console.log("Connected with iOS.");

    if (!("url" in window) && "webkitURL" in window) {
      window.URL = window.webkitURL;
    }

    localCam.addEventListener("change", function(file) {
      console.log("✔️playLocalCam_id: localCam: change");
      if (canvas.getContext) {
        let img = new Image();
        img.src = URL.createObjectURL(file.target.files[0]);

        let readImage = new Promise(function(resolve) {
          img.onload = function() {
            console.log("✔️playLocalCam_id: onload");
            self.$store.state.isIdentityDocument = true;
            self.uiflag.sample = false;
            self.uiflag.photo_box = false
            // let reader = new FileReader()
            // reader.readAsDataURL(file.target.files[0])
            // reader.onload = function () {
            // console.log(reader.result)
            adjustCanvasAngle(canvas, img, "id");

            return resolve(self.$refs.canvas.toDataURL("image/png"));

            // }
            // reader.onerror = function (error) {
            //     console.log('Error: ', error)
            // }
          };
        });
        readImage.then(function(result) {
          console.log("✔️playLocalCam_id: success");
          self.image = result;
          self.$refs.localCam.style.width = canvas.width + "px";
          self.$refs.localCam.style.height = canvas.height + "px";

          self.capture();
        });
      }
    });
  }
  function playLocalCam_face() {
    console.log("✔️playLocalCam_face");
    let localCam = self.$refs.localCam;
    let canvas = self.$refs.faceCanvas;
    self.$store.state.isFace = false;

    self.onLocalcam()
    
    self.$refs.localCam.style.width = self.width_and_height_face + "px";
    self.$refs.localCam.style.height = self.width_and_height_face + "px";
    console.log("Connected with iOS.");

    if (!("url" in window) && "webkitURL" in window) {
      window.URL = window.webkitURL;
    }
    if (ver === "automatic") {
      localCam.addEventListener("mouseup", async function() {
        console.log("✔️playLocalCam_face: localCam: mouseup");
        self.loading = true;
      });
    }
    localCam.addEventListener("change", async function(file) {
      console.log("✔️playLocalCam_face: localCam: change");
      console.time("⌚calc_face_detecting_time_with_localcam")
      
      if (canvas.getContext) {
        let img = new Image();
        img.src = URL.createObjectURL(file.target.files[0]);
        const image = await faceapi.bufferToImage(file.target.files[0]);
        const c2 = faceapi.createCanvasFromMedia(image);
        const displaySize = {
          width: self.width_and_height_face,
          height: self.width_and_height_face,
        };
        faceapi.matchDimensions(c2, displaySize);

        let readImage = new Promise(function(resolve) {
          img.onload = function() {
            console.log("✔️readImage: onload");
            if (self.$refs.photo_box) self.$refs.photo_box.classList.add("off");

            self.$store.state.isIdentityDocument = true;
            self.uiflag.sample = false;
            // canvas.classList.remove('off')

            // let reader = new FileReader()
            // reader.readAsDataURL(file.target.files[0])
            // reader.onload = function () {
            // console.log(reader.result)
            adjustCanvasAngle(canvas, img, "face");

            return resolve(canvas.toDataURL("image/png"));

            // }
            // reader.onerror = function (error) {
            //     console.log('Error: ', error)
            //     reject(error)
            // }
          };
        });
        readImage.then(async function(result) {
          console.log("✔️readImage: success");
          // console.log(result)
          self.image = result;
          self.uiflag.focus = false;
          self.uiflag.canvas = true;
          self.$refs.localCam.style.width = canvas.width + "px";
          self.$refs.localCam.style.height = canvas.height + "px";

          self.$store.state.isFace = true;
          if (ver === "automatic") {
            await faceDetecting_iOS();
          } else {
            self.uiflag.next_btn = true;
            self.loading = false;            

            comm.showCheckBtn(self);
          }
          
          console.timeEnd("⌚calc_face_detecting_time_with_localcam")
        });
      }
    });
  }
  async function faceDetecting_iOS() {
    console.log("✔️faceDetecting_iOS");
    let faceCut = self.$refs.faceCut;
    let queryImage = self.$store.state.queryImage;

    let msg3_1 = self.$t("message.step3-1");
    let msg3_2 = self.$t("message.step3-2");
    let msg3_2_a = self.$t("message.step3-2-a");
    let msg3_2_b = self.$t("message.step3-2-b");

    // console.log('faceCut', faceCut)

    let faceObj = await faceapi
      .detectSingleFace(
        faceCut,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 128 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    console.log("faceObj", faceObj);

    if (faceObj ? faceObj : "") {
      self.$store.state.isFace = true;
      let bestMatch = await faceCompare(self, faceObj, queryImage);
      // console.log('bestMatch', bestMatch)
      if (bestMatch) {
        if (bestMatch.distance) {
          // statndard Threshold 50%
          if (Math.round(bestMatch.distance * 100) / 100 <= 0.5) {
            self.faceCompareFlag = true;
            self.loading = false;
            // targetEvent(self, faceObj, streamDetecting)
            self.uiflag.sample = false;
            // self.uiflag.canvas = true
            self.uiflag.next_btn = true;
            
            comm.showCheckBtn(self)

          } else {
            alert_layerPopup(msg3_1, msg3_2_b, "Matched rate was below 50%.");
          }
          console.log(
            "face Match: statndard Threshold 50%, ",
            (1 - Math.round(bestMatch.distance * 100) / 100) * 100 + "% 일치, ",
            "결과: " + self.faceCompareFlag
          );
        } else {
          alert_layerPopup(
            msg3_1,
            msg3_2_a,
            "Could not refer to matched distance."
          );
        }
      } else {
        alert_layerPopup(msg3_1, msg3_2_a, "Not found BestMatch object");
      }
    } else {
      alert_layerPopup(msg3_1, msg3_2, "Not found faceObj object");
    }
  }
  function alert_layerPopup(err_content1, err_content2, error_info) {
    console.log("✔️alert_layerPopup");
    self.faceCompareFlag = false;

    self.popup.err_content1 = err_content1;
    self.popup.err_content2 = err_content2;
    self.popup.alert_flag = true;
    self.uiflag.canvas = false;
    self.loading = false;
    self.uiflag.sample = true;

    throw new Error("⛔ "+error_info);
  }
  function adjustCanvasAngle(canvas, img, type) {
    console.log("adjustCanvasAngle");
    let ctx = canvas.getContext("2d");
    let w, h;
    let rate;
    let img_w = img.width;
    let img_h = img.height;
    let screenRate = 0

    // 화면대비 실제 이미지 간의 비율 추출
    if(window.orientation === 0){
      screenRate = (window.innerWidth * 0.85) / img_w;
    }else{
      screenRate = (600 * 0.85) / img_w;
    }
    if (type === "id") {
      if (img_w < img_h) {
        rate = 1 - img_w / img_h;
        w = img_w * screenRate;
        h = w - w * rate;
        
        canvas.width = w
        canvas.height = h
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-(canvas.height / 2), -(canvas.width / 2));
        ctx.drawImage(img, 0, 0, canvas.height, canvas.width);
        ctx.restore();
      } else {
        rate = 1 - img_h / img_w;
        w = img_w * screenRate;
        h = w - w * rate;
        
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    } else if (type === "face") {
      rate = 1 - img_h / img_w;
      w = img_w * 0.7 * screenRate;
      h = w - w * rate;

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = canvas.width + "px";
      canvas.style.height = canvas.height + "px";

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      return false;
    }
  }
}
