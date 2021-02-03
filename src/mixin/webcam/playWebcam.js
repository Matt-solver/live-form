import { timerCallback } from "./computeFrame";

export function playWebcam(self) {
  console.log("⭐⭐playWebcam");
  self.uiflag.sample = false;
  let realWidth = self.width_1024;
  let realHeight = realWidth * self.ID_type_Rate;

  if (self.stepType === "id") {
    self.c1.width = realWidth;
    self.c1.height = realHeight;
    // self.c2.width = self.width_id;
    // self.c2.height = self.height_id;
  } else {
    self.faceCanvas.width = realWidth;
    self.faceCanvas.height = realWidth;
  }
  standByLive();

  function standByLive() {
    console.log("✔️standByLive");
    // let deviceArr =[]
    let width_and_height_face = window.innerWidth * 0.85;
    // requestPermission()
    let constraints = { audio: false, video: {} };

    console.log("self.stepType", self.stepType);
    if (self.stepType === "id") {
      if (window.orientation > 0) {
        constraints.video.width = { ideal: realWidth + 10 };
        constraints.video.height = { ideal: realHeight };
      } else {
        constraints.video.width = { ideal: realHeight };
        constraints.video.height = { ideal: realWidth + 10 };
      }
      constraints.video.facingMode = "environment";
      constraints.video.focusMode = "manual";
    } else if (self.stepType === "face") {
      constraints.video.width = width_and_height_face;
      constraints.video.height = width_and_height_face;
      constraints.video.facingMode = "user";
    } else {
      throw new Error("⛔ No step type");
    }
    console.log("⚙️constraints:", constraints);

    let success = function(mediastream) {
      console.log("✔️standByLive.success");
      if (mediastream) {
        if (self.$refs.video) self.$refs.video.srcObject = mediastream;
        // const videoTrack = mediastream.getVideoTracks()[0];
        // const capabilities = videoTrack.getCapabilities();
        // console.log("capabilities", capabilities);

        // if(self.sign.computFrame){
          timerCallback(self); //computeFrame  
        // }
        self.onVideo();
        /*** Check whether focusDistance is supported or not. ***
        if (!capabilities.focusDistance) { return }
        if (capabilities.focusMode){
            // Map focus distance to a slider element.
            const input = document.querySelector('input[type="range"]')
            if(input){
                input.min = 0
                input.max = 1
                input.step = capabilities.focusDistance.step
                input.value = videoTrack.getSettings().focusDistance;
                input.oninput = function(event) {
                    let value = Math.round(event.target.value*100)/100
                    console.log(value)

                    videoTrack.applyConstraints({
                        advanced: [
                            {focusMode: "manual",focusDistance: value}
                        ]})
                    console.log(videoTrack.getSettings())   // By default continuous value is set for focusMode
                }
                input.hidden = false
            }
        }/*****/
      }
    };

    // Execute video listeners
    let flag = true
    let mediaArr = [
      navigator.mediaDevices, 
      navigator, 
      // navigator.webkitGetUserMedia,
      // navigator.mozGetUserMedia
    ]
    if (navigator){
      for(let m of mediaArr){
        if(flag === true && m){
          flag = false
          console.log(`💡 Connected ${m}`)
          if(m.getUserMedia){
            m.getUserMedia(constraints)
            .then(success)
            .catch((err) =>
            console.error(`Fail ${m}`, err)
            )          
          }else{
            flag = true
          }
        }else{
          flag = true
        }
      }
    }else{
      self.nocam = true;
      self.error =
        "Video is not supported. Please run it in a supported environment.";
      console.error("Not supported media devices");

    }

  }
}
