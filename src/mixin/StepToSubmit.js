import comm from './common';
import submit from './submit';

export const StepToSubmit = {
  data() {
    return {
      step: 4,
      cnt: 0,
      failcnt: 0,
      alert_flag2: false,
      isOnline: comm.checkNetwork(),
      popup: {
        alert_flag: false,
        err_content1: '',
        err_content2: '',
      },
      rs_params: '',
      orientation: 0,
      resizeFlag: 'vertical',
      progressValue: 0,
    };
  },
  create: function() {
    this.failcnt = self.$session.get('_failCnt');
  },
  async mounted() {
    console.log('%c' + '🔥🔥🔥🔥🔥 STEP 4 프로세싱 단계 🔥🔥🔥🔥🔥', 'color:blue;font-weight:bold;');

    let self = this;
    // comm.inspectSession(self);

    // 가로화면 세팅
    self.orientation = window.orientation;
    // document.onclick = function() {
    //   self.orientation = window.orientation;
    // };

    self.cnt = 10;
    comm.scoreCounter(self, self.cnt, 40);

    console.log(':::::::::::::::: Submit ::::::::::::::::');
    if (this.isOnline) {
      let ds_params = this.$store.getters['dataset/GET_DS_PARAMS'];

      console.time('processingTime');
      try {
        this.rs_params = await self.submit(self, ds_params, 'LiveKYC');
      } catch (error) {
        throw new Error('⛔' + error);
      }
      console.timeEnd('processingTime');

      console.log('Step4 SubmitResult', JSON.stringify(this.rs_params, null, 2));

      // Limited Age
      let age = 19; //dummy age
      // if(self.$store.state.submitResult.limited_age <= self.$store.state.LMT_AGE)  self.alert_flag2 = true
      if (age <= self.$store.state.LMT_AGE) {
        self.alert_flag2 = true;
        return;
      }
    } else {
      self.popup.err_content1 = 'An occured Network Error';
      self.popup.err_content2 = 'Internet Disconnected.';
      self.popup.alert_flag = true;
    }
  },
  watch: {
    orientation: function() {
      switch (window.orientation) {
        case 0:
          comm.viewportZoomset(1.0, 1.0, 1.0);
          break;
        default:
          comm.viewportZoomset(0.45, 0.45, 0.45);
          break;
      }
    },
    resizeFlag: function() {
      console.log('✔️resizeFlag');
      if (this.resizeFlag === 'horizontal') {
        console.log('가로모드 실행');
        this.orientation = window.orientation;
      } else {
        console.log('세로모드 실행');
        this.orientation = window.orientation;
      }
    },
    progressValue: function() {
      let screen = document.querySelector('.screen');
      if (this.progressValue >= 100) {
        console.log('✔️Complete progress');
        setTimeout(() => {
          screen.classList.remove('fadein');
          screen.classList.add('fadeout');
          this.$router.push({
            name: 'Step5',
            params: { rs_params: this.rs_params },
          });
        }, 1000);
      }
    },
  },
  methods: {
    submit,
    onResize() {
      let x = window.innerWidth;
      let y = window.innerHeight;
      if (x > y) {
        this.resizeFlag = 'horizontal';
      } else {
        this.resizeFlag = 'vertical';
      }
    },
    close_alert() {
      console.log('✔️close_alert');
      this.popup.alert_flag = false;
    },
    backBtn() {
      if (this.$session.exists()) {
        this.$router.push(
          `/main/SelectIdType?pid=${this.$session.get('_projectId')}&email=${this.$session.get('_email')}&theme=${
            this.$store.state.isDark
          }&apiKey=${comm.get_localStorage_with_expiry('_apiKey')}&oobCode=${comm.get_localStorage_with_expiry(
            '_oobCode',
          )}&mode=signIn`,
        );
      } else {
        window.location.href = 'https://argos-solutions.io/ko/';
      }
    },
  },
};
