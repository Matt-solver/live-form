import { setTimeout } from "core-js";

// loof video
export function timerCallback(self) {  
  // console.log('self.onvideo', self.onvideo)
  if (self.video) {
    if (!self.onvideo){ 
      console.log("✔️Video shutdown!")
      return 
    }
    // else{
    if (!self.sign.capture) computeFrame(self);
    setTimeout(function() {
      timerCallback(self);
    }, 0);
    // }
  }
}
// Drawing 'Transparency Card frame' on screen
function computeFrame(self) {
  let w = self.width_id;
  let h = self.height_id;
  let realWidth = self.width_1280;
  //Exclude Video frame Latency
  self.runVideo = true;
  self.photo_area = true;
  if (self.stepType === "face") {
    self.ctx.drawImage(self.video, 0, 0, realWidth, realWidth);
  } else {
    self.ctx.drawImage(
      self.video,
      0,
      0,
      realWidth,
      realWidth * self.ID_type_Rate
    );
    let frame = self.ctx.getImageData(0, 0, w, h);
    let l = frame.data.length / 4;
    let expArr = [];
    let boundaryArr = [];
    let expCnt = 0;
    let glareArray = [];
    let tmp_glareArr = [];
    let total_glare = 0;

    for (let i = 0; i < l; i++) {
      // configuring RGB pixel
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];

      if (r > 200 && g > 200 && b > 200 && r <= 252 && g <= 252 && b <= 252) {
        boundaryArr.push(1);
      } else {
        boundaryArr.push(0);
      }
      if (r > 252 && g > 252 && b > 252) {
        expArr.push(1);
      } else {
        expArr.push(0);
      }
    }

    //Glare detecting
    for (let i = 0; i <= expArr.length; i++) {
      if (expArr[i] !== 0)
        if (expArr[i - 1] + expArr[i] === 2) {
          expCnt += 1;
        } else {
          if (expCnt > 5)
            // Glare로 추정되는 군집 5개 이상 나오는 경우 기록
            glareArray.push(expCnt);
          expCnt = 0; // 카운팅 초기화
        }
    }
    total_glare += glareArray.length;
    tmp_glareArr.push(glareArray.length);
    let glare = total_glare / tmp_glareArr.length;

    // Glare detecting
    if (glare > 2) {
      self.flash = true;
      if (self.tot > 0) self.tot -= 5;
    }
    if (self.sign.capture !== true) {
      if (glare <= 2) self.flash = false;
    }
    self.ctx.putImageData(frame, 0, 0);
    self.progress = self.tot;
  }
}
