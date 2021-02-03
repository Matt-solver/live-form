let x_arr = [],
  y_arr = [],
  width_arr = [],
  height_arr = [],
  confidence_arr = [];

module.exports = {
  checkNetwork() {
    console.log("☑️checkNetwork")
    if (!navigator.onLine) {
      return false;
    } else {
      return true;
    }
  },
  // inspectSession: function(self) {
  //   console.log("☑️inspectSession")
  //   //inspect session
  //   if (self.$session.get("_projectId") && self.$session.get("_email")) {
  //     return true;
  //   } else {
  //     self.$router.push({ name: "ErrorPage", params: { errorType: 404 } });
  //     return false;
  //   }
  // },
  // apply_theme_dark: function(){
  //     document.querySelector('.v-main__wrap').style.background = '#20252b';
  //     document.querySelector('html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video, button').style.background = '#fff';
  //     document.querySelector('html, body, div, p, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video, button').style.color = '#fff';
  //     if(document.querySelector('.e-mail_wrap')) {
  //         document.querySelector('.e-mail_wrap P').style.color = '#fff';
  //         document.querySelector('.e-mail_wrap input').style.background = '#525c69';
  //         document.querySelector('.e-mail_wrap input').style.color = '#fff';
  //     }
  //     if(document.querySelector('.select_box')) {
  //       document.querySelector('.select_box').style.background = '#20252b';
  //       if(document.querySelector('.select_box>div')) document.querySelector('.select_box>div').style.borderBottom = '1px solid #2c3039';
  //       if(document.querySelector('.select_box>a>p')) document.querySelector('.select_box>a>p').style.borderBottom = '1px solid #2c3039';
  //       if(document.querySelector('.select_box>a')) document.querySelector('.select_box>a').style.color = '#fff';
  //     }
  //     if(document.querySelector('.bar>p')) document.querySelector('.bar>p').style.color = '#fff';
  //     if(document.querySelector('.select_country>p')) document.querySelector('.select_country>p').style.color = '#fff';
  //     if(document.querySelector('.bar')) document.querySelector('.bar').style.background = '#20252b';
  //     if(document.querySelector('.select_country>input')) document.querySelector('.select_country>input').style.color = '#fff';
  //     if(document.querySelector('.country_list')) document.querySelector('.country_list').style.background = '#20252b url(../../img/next.png) no-repeat center right 7.5%';
  //     if(document.querySelector('.select_id')) document.querySelector('.select_id').style.background = '#20252b';
  //     if(document.querySelector('.modal_1, .successed')) document.querySelector('.modal_1, .successed').style.background = '#20252b';

  // },
  stopStreamedVideo: function(videoElem) {
    console.log("☑️stopStreamedVideo")
    if (videoElem) {
      if (videoElem.srcObject) {
        const stream = videoElem.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
          track.stop();
        });

        videoElem.srcObject = null;
      }
    }
  },
  //(Common)모든 공백제거
  rmBlank: (str) => str.replace(/(\s*)/g, ""),

  enumerateDevices: async () => {
    console.log("☑️enumerateDevices")
    let deviceArr = [];
    // navigator.mediaDevices.getUserMedia({ audio: false,  video: {} }).then(mediaStream => console.log(mediaStream))
    if (navigator.mediaDevices) {
      return navigator.mediaDevices.enumerateDevices().then(function(devices) {
        devices.map(async (device) => {
          if (device.kind === "videoinput") {
            deviceArr.push(device);
            // console.log("device", device);
            // console.log("device.kind", device.kind);
          }
        });
        return deviceArr;
      });
    } else {
      console.error("Not supported media devices");
    }
  },
  // changeStep: (value) => {
  //     this.$emit('child-step', value)
  // },
  hasGetUserMedia: function(navigator) {
    console.log("☑️hasGetUserMedia")
    // Check the cam exists
    return !!(
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  },
  isMobile: function(device) {
    console.log("☑️isMobile")
    const labels = [
      "iphone",
      "ipad",
      "mac",
      "android",
      "pixel",
      "webos",
      "bada",
      "blackberry",
      "nokia",
      "meego",
      "symbian",
    ];
    return !!(labels.indexOf(device) > -1 ? true : false);
  },
  getDeviceName: function() {
    console.log("☑️getDeviceName")
    const userAgent = navigator.userAgent.toLowerCase();
    // console.log("device information", userAgent);
    const labels = [
      "iphone",
      "ipad",
      "mac",
      "android",
      "pixel",
      "webos",
      "bada",
      "blackberry",
      "nokia",
      "meego",
      "symbian",
      "windows",
      "linux",
    ];
    let result = labels.filter((el) => userAgent.indexOf(el) > -1);

    // console.log("getDeviceName", result);

    return result[0];
  },
  getBrowserName: function() {
    console.log("☑️getBrowserName")
    const userAgent = navigator.userAgent.toLowerCase();
    // console.log("browser information", userAgent);
    const labels = [
      "msie",
      "edg",
      "opera",
      "vivaldi",
      "whale",
      "samsung",
      "slimjet",
      "midori",
      "firefox",
      "chrome",
      "safari",
    ];
    let result = labels.filter((el) => userAgent.indexOf(el) > -1);

    // console.log("getBrowserName", result);

    return result[0];
  },
  errorPage: function(errorType, step, message, failcnt) {
    console.log("☑️errorPage")
    // document.querySelector("#matt").innerHTML = "";
    // document.querySelector("#img").classList.add('off');
    this.$router.push({
      name: "ErrorPage",
      params: {
        step: step ? step : "",
        message: message ? message : "",
        errorType: errorType ? errorType : "",
        failcnt: failcnt ? failcnt : 0,
      },
    });
  },
  curry: (fn) => {
    let arity = fn.length;

    return (function resolver() {
      let memory = Array.prototype.slice.call(arguments);
      return function() {
        let local = memory.slice();
        Array.prototype.push.apply(local, arguments);
        let next = local.length >= arity ? fn : resolver;
        return next.apply(null, local);
      };
    })();
  },
  extractErrorcode: (func) => (value) =>
    value.toString().indexOf("Error") > -1 ? func(value) : value,
  default: (value) => {
    return value;
  },
  //숫자만 추출
  extractInt: (str) => {
    const reg = /[^0-9]/g;
    return reg.test(str) ? parseInt(str.replace(reg, "")) : str;
  },
  //문자만 추출
  extractString: (str) =>
    /[^a-zA-Z]/g.test(str) ? str.replace(/[^a-zA-Z]/g, "") : str,
  getBlobImg: (data) => {
    console.log("☑️getBlobImg")
    return new Promise((resolve) => {
      data.toBlob(
        async function(blob) {
          resolve(blob);
        },
        "image/png",
        1
      );
    });
  },
  blobToFile: (blob, fileName) => {
    console.log("☑️blobToFile")
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    blob.lastModifiedDate = Date.now();
    blob.name = fileName;
    return blob;
  },
  calcAverage: () => {
    console.log("☑️calcAverage")
    return (obj) => {
      x_arr.push(obj.x);
      y_arr.push(obj.y);
      width_arr.push(obj.width);
      height_arr.push(obj.height);
      confidence_arr.push(obj.confidence);

      let x_avr = x_arr.reduce((a, b) => a + b) / x_arr.length;
      let y_avr = y_arr.reduce((a, b) => a + b) / y_arr.length;
      let width_avr = width_arr.reduce((a, b) => a + b) / width_arr.length;
      let height_avr = height_arr.reduce((a, b) => a + b) / height_arr.length;
      let confidence_avr =
        confidence_arr.reduce((a, b) => a + b) / confidence_arr.length;

      return `average - x:${x_avr.toFixed(2)} y:${y_avr.toFixed(
        2
      )} width:${width_avr.toFixed(2)} height:${height_avr.toFixed(
        2
      )} confidence:${confidence_avr.toFixed(2)}`;
    };
  },
  scoreCounter: function(self, limit, speed) {
    console.log("☑️scoreCounter")
    let start = setInterval(() => {
      if (self.$store.state.progressValue >= limit) {
        clearInterval(start);
      } else {
        self.progressValue++;
        return self.$store.state.progressValue++;
      }
    }, speed);
  },
  viewportZoomset: function(initial, minimum, maximum) {
    console.log("☑️viewportZoomset")
    let viewport = document.querySelector("meta[name='viewport']");
    viewport.content =
      "initial-scale=" +
      initial / 2 +
      ", minimum-scale=" +
      minimum / 2 +
      ", maximum-scale=" +
      maximum / 2;
    setTimeout(function() {
      viewport.content =
        "initial-scale=" +
        initial +
        ", minimum-scale=" +
        minimum +
        ", maximum-scale=" +
        maximum;
    }, 350);
  },
  set_localStorage_with_expiry: function(key, value, holdingTime) {
    console.log("☑️set_localStorage_with_expiry")
    const expiry = Date.now() + holdingTime;
    const item = {
      value: value,
      expiry: expiry,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  get_localStorage_with_expiry: function(key) {
    console.log("☑️get_localStorage_with_expiry")
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return "no_apiky";
    }
    const item = JSON.parse(itemStr);
    const now = Date.now();
    // console.log('now: '+now)
    // console.log('item.expiry: '+item.expiry)
    if (now > item.expiry) {
      return "Expired";
    }
    return item.value;
  },
  showCheckBtn: function(self) {  
    console.log("☑️showCheckBtn")  
    self.uiflag.success = true;
    setTimeout(() => {
      if (self.$refs.successed_wrap)
        self.$refs.successed_wrap.classList.add("fadeout");
      setTimeout(() => {
        self.uiflag.success = false;
      }, 1000);
    }, 1000);
  }
};
