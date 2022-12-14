import comm from './common';
import { playWebcam } from './webcam/playWebcam';
import { autoCapture } from './webcam/autoCapturing';
import { playLocalCam } from './webcam/playLocalCam';
import { setTimeout } from 'timers';
import * as DTO from '@/model/DataObject';
import { mapActions, mapGetters } from 'vuex';

export const StepToTakeFacePhoto = {
  data() {
    return {
      title: this.$t('message.step3-1'),
      is_iOS: false,
      stepType: 'face',
      btn_flag: false,
      faceCompareFlag: false,
      step: 2,
      message: null,
      //Privacy info
      idProcessID: null,
      processType: null,
      type: null,
      tmpId: null,
      //Device info
      nocam: null,
      error: null,
      failcnt: 0,
      deviceId: null,
      devices: [],
      loading: true,
      video: null,
      sign: {
        computFrame: true,
        capture: false,
      },
      uiflag: {
        localCamBtn: true,
        photo_area: false,
        video: false,
        success: false,
        sample: true,
        localCam: false,
        photo_box: true,
        next_btn: false,
        shot_btn: false,
        canvas: false,
        thumbnail: false,
        focus: true,
        retry_btn: false,
      },
      browser: null,
      //canvas
      width_1280: 1280,
      width_1024: 1024,
      ID_type_Rate: null,
      faceCanvas: null,
      ctx: null,
      image: null,
      recData: null,
      width_and_height_face: 0,
      today: '',
      failcount: 0,
      resFaceDetect: false,
      //Alert
      popup: {
        alert_flag: false,
        err_content1: '',
        err_content2: '',
      },
      //--Privacy info
      Issue_country_name: this.$store.state.Issue_country_name ? this.$store.state.Issue_country_name : '',
      Issue_country_code: this.$store.state.Issue_country_code ? this.$store.state.Issue_country_code : '',

      orientation: 0,
      resizeFlag: 'vertical',

      stateFaceCheck: true,

      classes: {
        localCam: 'localCam pa-0 absolute transparent limit-width z-index-5',
      },
      onvideo: true,
    };
  },
  create: function() {
    //?????? ????????? ???????????????.
    this.failcnt = this.$session.get('_failCnt');
    this.resFaceDetect = false;
  },
  async mounted() {
    console.log('%c' + '???????????????????? STEP 3 Face still cut ????????????????????', 'color:blue;font-weight:bold;');

    // comm.inspectSession(this);

    // ???????????? ??????
    this.orientation = window.orientation;
    // document.onclick = function() {
    //   self.orientation = window.orientation;
    // };
    let device = this.$store.state.device;

    if (!device) return;

    if (!this.$store.state.is_iOS) {
      this.uiflag.sample = false;
      this.showBtnTimer();
    }
    this.nationality = this.$store.state.nationality;
    this.nation_code = this.$store.state.nation_code;
    this.type = this.$store.state.type;
    this.tmpId = this.$store.state.tmpId;
    this.video = this.$refs.video;
    this.focusImg = this.$refs.focus;
    this.faceCanvas = this.$refs.faceCanvas;
    this.ctx = this.$refs.faceCanvas.getContext('2d');

    let screen = this.$refs.screen;
    let viewportRatio = 0.5;
    if (window.orientation === 0) {
      this.width_and_height_face = screen.offsetWidth * 0.85;
    } else {
      this.width_and_height_face = screen.offsetWidth * viewportRatio * 0.85;
    }

    if (this.video) {
      this.video.width = this.width_and_height_face;
      this.video.height = this.width_and_height_face;
      //Front Webcam Mirroring
      this.video.classList.add('mirror');
    }
    if (this.$refs.faceCanvas) {
      this.$refs.faceCanvas.width = this.width_and_height_face;
      this.$refs.faceCanvas.height = this.width_and_height_face;
      this.$refs.faceCanvas.style.width = this.width_and_height_face + 'px';
      this.$refs.faceCanvas.style.height = this.width_and_height_face + 'px';
    }
    if (this.$refs.faceCut) {
      this.$refs.faceCut.width = this.width_and_height_face;
      this.$refs.faceCut.style.width = this.width_and_height_face * 0.7 + 'px';
    }
    this.$store.state.is_iOS === false && (await this.playWebcam(this, 'face'));
    this.$store.state.is_iOS === true && this.playLocalCam(this);
    this.$store.state.is_iOS === false && this.$store.state.ver === 'automatic' && this.autoCapture(this);

    // ?????? ?????? ????????? ??????
    if (this.$store.state.is_iOS) {
      this.uiflag.sample = true;
      this.uiflag.shot_btn = false;
    } else if (this.$store.state.ver === 'automatic') {
      this.uiflag.sample = false;
      this.uiflag.shot_btn = true;
      this.showBtnTimer();
    } else {
      this.uiflag.sample = false;
      this.uiflag.shot_btn = true;
      this.onButton();
    }
  },
  watch: {
    orientation: function() {
      // let self = this;
      switch (window.orientation) {
        case 0:
          comm.viewportZoomset(1.0, 1.0, 1.0);
          break;
        default:
          comm.viewportZoomset(0.45, 0.45, 0.45);
          this.focusImg.style.maxWidth = this.video.width + 'px';
          this.focusImg.style.maxHeight = this.video.height + 'px';
          break;
      }
    },
    resFaceDetect: function() {
      this.next_step();
    },
    resizeFlag: function() {
      console.log('??????resizeFlag');
      if (this.resizeFlag === 'horizontal') {
        console.log('???????????? ??????');
        this.orientation = window.orientation;
      } else {
        console.log('???????????? ??????');
        this.orientation = window.orientation;
      }
    },
  },
  computed: {
    ...mapGetters('optionStore', ['GET_KYC_LEVEL']),
    ...mapGetters('dataset', ['GET_DS_PARAMS']),
  },
  methods: {
    ...mapActions('dataset', ['ACT_FACE_IMAGE']),
    playWebcam,
    autoCapture,
    playLocalCam,

    onResize() {
      let x = window.innerWidth;
      let y = window.innerHeight;
      if (x > y) {
        this.resizeFlag = 'horizontal';
      } else {
        this.resizeFlag = 'vertical';
      }
    },
    onLocalcam() {
      console.log('??????onLocalcam');
      this.loading = false;
      this.uiflag.video = false;
      this.btn_flag = true;
      this.uiflag.localCam = true;
      this.uiflag.photo_area = true;
    },
    close_alert() {
      console.log('??????close_alert');
      this.popup.alert_flag = false;
      if (!this.$store.state.isFace) {
        this.$router.push('TakeIdPhoto');
      }
    },
    showBtnTimer: async function() {
      let self = this;
      let count = self.$store.state.ver === 'automatic' ? 5000 : 0;
      let btnTimer = setTimeout(() => {
        this.onButton();
        clearTimeout(btnTimer);
      }, count);
    },
    onButton() {
      console.log('??????onButton');
      this.btn_flag = true;
      this.shot_btn = true;
      this.$refs.shotBtn.classList.remove('opacity');
    },
    offButton() {
      console.log('??????offButton');
      this.btn_flag = false;
      this.shot_btn = true;
      this.$refs.shotBtn.classList.add('opacity');
    },
    onVideo() {
      console.log('??????onVideo');
      this.loading = false;
      this.uiflag.video = true;
      this.uiflag.photo_area = true;
    },
    next_step() {
      console.log('??????next_step');
      let self = this;
      if (self.btn_flag === false) return;
      self.video.pause();

      //check isface in the captured stream
      console.log('isFace', this.$store.state.isFace);

      if (self.$store.state.ver !== 'automatic') self.$store.state.isFace = true;
      if (self.$store.state.isFace === true) {
        comm.showCheckBtn(self);

        setTimeout(() => {
          self.sign.capture = true;
          self.loading = true;
          // ?????? ?????? ????????? ?????? ????????????
          if (self.$refs.shot_btn) self.$refs.shot_btn.disabled = true;
          //add only face image in the ds_params object
          console.log(':::::::::::::::: Dataset ::::::::::::::::');
          let params = new DTO.DatasetParams({
            faceImage: self.faceCanvas.toDataURL('image/png'),
          });

          //combine face image to Dataset instance
          this.ACT_FACE_IMAGE(params.getFaceImage);

          self.$refs.screen.classList.remove('fadein');
          self.$refs.screen.classList.add('fadeout');

          if (this.GET_KYC_LEVEL === 'L2') {
            //L2 ??? ?????? Address ???????????? push
            setTimeout(() => {
              self.$router.push('ProofOfAddress');
            }, 1000);
          } else {
            setTimeout(() => {
              self.$router.push('SubmitKyc');
            }, 1000);
          }
        }, 1000);
      } else {
        (self.popup.err_content1 = this.$t('message.step3-2')),
          (self.popup.err_content2 = this.$t('message.step3-4')),
          (this.popup.alert_flag = true);
      }

      this.onvideo = false;
    },
    retry: function() {
      console.log('??????retry');
      this.uiflag.localCamBtn = true;
      this.uiflag.next_btn = false;
      this.uiflag.retry_btn = false;
      this.uiflag.sample = true;
      this.uiflag.thumbnail = false;
    },
    backBtn: async function() {
      console.log('??????backBtn');
      this.onvideo = false;
      comm.stopStreamedVideo(document.querySelector('#video'));
      if (this.$session.exists()) {
        this.stepType = 'id';
        this.stateFaceCheck = false; //flag ???????????? faceTracking ?????? ????????? ?????? stop ?????????
        this.$router.push('TakeIdPhoto');
      } else {
        window.location.href = 'https://argos-solutions.io/ko/';
      }
    },
  },
};
