import firebase from 'firebase/app';
import 'firebase/auth';
import QRCode from 'qrcode';
import comm from './common';
import countries from 'i18n-iso-countries';
import axios from 'axios';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export const StepToSelectIdType = {
  data() {
    return {
      windowSize: {
        x: 0,
        y: 0,
      },
      isOnline: comm.checkNetwork(),
      isEmailAuth: false,
      compareTarget: '',
      lang: 'en',
      languageKeys: [],
      languageValues: [],
      tmp: [],
      language: '',
      logoFlag: true,
      popup: {
        alert_flag: false,
        err_content1: '',
        err_content2: '',
      },
      loading: true,
      regionCode: false,

      // Select box layer
      selectBoxFlag: false,
      psptFlag: false, // passport
      dlsFlag: false, // driver license
      govidFlag: false, // goverment id

      pid: this.$route.query.pid ? this.$route.query.pid : '',
      email: this.$route.query.email ? this.$route.query.email : '',
      theme: this.$route.query.theme ? this.$route.query.theme : '',
      userid: this.$route.query.userid ? this.$route.query.userid : '',
      envError: '',
      qrcode: null,
      dialog: false,
      info_massage: false,
      limitedTime: 300000,
      classes: [],
      current_time: '',
      orientation: 0,
      resizeFlag: 'vertical',
      // Flags
      flag: {},
      flag_email_wrap: false,
      flag_home_btn: false,
      flag_email: false,
      flag_isEmailVerified: false,
      flag_email_btn_click: false,
      flag_qrcode: false,
      flag_check_timeout_QR: true,
      flag_check_timeout_email: true,
      flag_checkDeviceEnv: false,
      flag_hasGetUserMedia: false,
      flag_enumerateDevices: false,
      flag_options: false,
      flag_wrap: false,
      flag_select_box: false,
      termsOfUse: '',
      privacyPolicy: '',

      selected: [],

      agreePersonal: false,
      agreePolicy: false,

      homeBtnClass: 'homeBtn text-center',
      loaderClasses: ['sumit_box', 'fadein', 'z-index-4', 'limit-width'],
    };
  },
  created: async function() {
    this.$session.start();
    this.$session.set('_projectId', this.pid);
    this.$session.set('_theme', this.theme);
    this.$session.set('_userid', this.userid); //userid ??????
    // this.$session.set("_failCnt", 0); //????????????
    this.$store.state.isDark = this.theme;
    await this.setLocation();
    this.flag_isEmailVerified = comm.validate('email', this.email);
  },
  async mounted() {
    console.log('%c ???????????????????? STEP 0 Select ID Type ????????????????????', 'color:blue;font-weight:bold;');
    this.setScreenHeight();

    const mode = this.$route.query.ver;
    const language = this.$store.state.language;

    // ???????????? ??????
    this.orientation = window.orientation;
    // document.onclick = function() {
    //   this.orientation = window.orientation;
    // };
    if (mode === 'automatic') this.$store.state.ver = 'automatic';
    else if (mode === 'manual') this.$store.state.ver = 'manual';
    else this.$store.state.ver = 'manual';
    this.language = navigator.language.substr(0, 2);
    this.lang = language[this.language].name;

    for (let i in language) {
      if (language[i].status) this.tmp.push(language[i]);
    }
    if (this.lang) {
      this.$i18n.locale = this.language;
      this.languageValues = this.tmp.map(obj => obj.name);
    }
    this.qrcode = this.$refs.qrcode;

    // Check if webcam is available
    this.flag_hasGetUserMedia = comm.hasGetUserMedia(navigator);
    // check if device environment is available
    this.flag_checkDeviceEnv = this.checkDeviceEnv();

    //check enumerateDevices
    let enumerateDevices = await comm.enumerateDevices();
    this.flag_enumerateDevices = enumerateDevices?.length > 0 ? true : false;

    if (
      // this.flag_options === true &&
      this.flag_checkDeviceEnv === true &&
      this.flag_hasGetUserMedia === true &&
      this.flag_enumerateDevices === true
    ) {
      this.flag_qrcode = false;
      console.log('???? This device supported KYC service ');

      this.flag_wrap = true;
    } else {
      this.runQRCode();
      this.flag_qrcode = true;
    }

    let timestamp_email = this.$route.query.emailtime;
    let timestamp_QR = this.$route.query.qrtime;
    if (this.isOnline) {
      //-- 20201207 ?????? api ????????????
      await this.getCustomizationOptions();
      // ????????? ?????? ?????? ??????
      if (this.GET_EMAIL_VERIFICATION === true) {
        if (this.$route.query.apiKey && this.$route.query.oobCode) {
          // check timeout
          if (timestamp_email) {
            this.flag_check_timeout_email = this.checkTimeout(timestamp_email, this.limitedTime);
            if (this.flag_check_timeout_email) {
              if (this.isEmailAuth) this.flag_home_btn = true;
              this.flag_email = false;

              this.isEmailAuthenticated() && this.loginStatusManagement();
            } else {
              this.flag_email = true;
              this.popup.err_content1 = this.$t('message.step0-12');
              this.popup.err_content2 = this.$t('message.step0-14');
              this.popup.alert_flag = true;
            }
          } else {
            if (this.isEmailAuth) this.flag_home_btn = false;
            this.flag_email = false;

            this.isEmailAuthenticated() && this.loginStatusManagement();
          }
        } else if (this.email) {
          this.flag_email = true;
          this.emailAuthentication();
        } else {
          this.flag_email = true;
        }
      } else if (!this.GET_EMAIL_VERIFICATION) {
        this.login();
      } else {
        this.flag_email = false;
      }

      //Inspect QR Code
      if (timestamp_QR) {
        this.flag_check_timeout_QR = this.checkTimeout(timestamp_QR, this.limitedTime);
        if (!this.flag_check_timeout_QR) {
          this.popup.err_content1 = this.$t('message.step0-13');
          this.popup.err_content2 = this.$t('message.step0-14');
          this.popup.alert_flag = true;
        }
      }

      this.loading = false;
    } else {
      this.popup.err_content1 = this.$t('message.step0-10');
      this.popup.err_content2 = this.$t('message.step0-11');
      this.popup.alert_flag = true;
    }
    if (this.$route.query.email && this.flag_isEmailVerified) {
      this.flag_email = false;
    } else {
      this.flag_email = true;
    }
  },
  watch: {
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
    orientation: function() {
      window.location.href = '#home';
      // const card = [".card-1", ".card-2", ".card-3"];
      const cards = ['.card-1'];
      switch (window.orientation) {
        case 0:
          for (let card of cards) {
            document.querySelector(card).style.height = window.innerHeight / 2 + 'px';
          }
          comm.viewportZoomset(1.0, 1.0, 1.0);
          break;
        default:
          for (let card of cards) {
            document.querySelector(card).style.height = window.innerHeight * 2.236842105263158 + 'px';
          }
          comm.viewportZoomset(0.45, 0.45, 0.45);
          break;
      }
    },
    agreePersonal: function() {
      // Save agreement
      this.$store.state.agreePersonal = true;
      if (this.agreePersonal)
        if (!this.agreePolicy)
          setTimeout(() => {
            window.location.href = '#policy';
          }, 50);
        else
          setTimeout(() => {
            this.show_id_selector();
          }, 100);
    },
    agreePolicy: function() {
      // Save agreement
      this.$store.state.agreePolicy = true;
      if (this.agreePolicy)
        if (!this.agreePersonal)
          setTimeout(() => {
            window.location.href = '#terms';
          }, 50);
        else
          setTimeout(() => {
            this.show_id_selector();
          }, 100);
    },
  },
  computed: {
    ...mapGetters('optionStore', [
      'GET_LOGO',
      'GET_TYPE',
      'GET_TERMS_OF_USE',
      'GET_PRIVACY_POLICY',
      'GET_EMAIL_VERIFICATION',
    ]),
  },
  methods: {
    ...mapActions('optionStore', ['ACT_OPTIONS']),

    disagree: function() {
      this.agreePersonal = false;
      this.agreePolicy = false;
      window.location.href = '#home';
    },
    setScreenHeight() {
      const cards = ['.card-1'];
      for (let card of cards) {
        if (window.orientation === 0) {
          document.querySelector(card).style.height = window.innerHeight + 'px';
        } else {
          document.querySelector(card).style.height = window.innerHeight * 2.236842105263158 + 'px';
        }
      }
    },
    close_alert() {
      console.log('??????close_alert');
      this.popup.alert_flag = false;
    },
    onResize() {
      const x = window.innerWidth;
      const y = window.innerHeight;
      if (x > y) {
        this.resizeFlag = 'horizontal';
      } else {
        this.resizeFlag = 'vertical';
      }
    },
    getCustomizationOptions: async function() {
      console.log('?????? getCustomizationOptions');
      const session = this.$session.get('_projectId');
      const pid = session ? session : this.$route.query.pid;
      try {
        // ???????????? ????????? ????????? ?????? ????????????.
        const getOptions = firebase
          .app()
          .functions('asia-northeast1')
          .httpsCallable('getCustomizationOptions');
        const options = await getOptions({ params: { ds_pid: pid } });
        if (options.data && options.data !== 'No response data') {
          console.log('???????????? options ????????????');
          console.log(JSON.stringify(options, null, 2));

          if (this.$route.query.demo === 'login') {
            options.data.rs_emailVerification = false;
          }

          // ?????? ????????? ???????????? Store ??????
          this.ACT_OPTIONS(options.data);
          console.log('Use Email Verification', options.data.rs_emailVerification);

          if (this.GET_LOGO) {
            this.flag_email_wrap = true;
          }

          this.termsOfUse = options.data.rs_termsOfUse; //???????????? url
          this.privacyPolicy = options.data.rs_privacyPolicy; //?????????????????? url

          console.log('????????????', this.termsOfUse);
          console.log('??????????????????', this.privacyPolicy);

          this.flag_options = true;
          this.logoFlag = true;
        } else {
          this.flag_options = false;
          this.logoFlag = true;
          this.flag_home_btn = true;
          this.flag_email_wrap = true;
          // comm.errorPage.apply(this, 401);
        }
      } catch (error) {
        throw new Error('???' + error);
      }
    },
    loginStatusManagement: function() {
      console.log('??????loginStatusManagement');
      const local_apikey = comm.get_localStorage_with_expiry('_apiKey');
      const local_oobcode = comm.get_localStorage_with_expiry('_oobCode');
      const email_link_apikey = this.$route.query.apiKey;
      const email_link_oobcode = this.$route.query.oobCode;
      const msg12 = this.$t('message.step0-12');
      const msg15 = this.$t('message.step0-15');
      const msg16 = this.$t('message.step0-16');
      if (email_link_apikey && email_link_oobcode) {
        if (email_link_apikey !== 'Expired' || email_link_oobcode !== 'Expired') {
          if (local_apikey === 'no_apiky' && email_link_apikey) {
            if (this.$session.get('_email') === this.$route.query.email) {
              this.signup();
            } else {
              this.logout(msg12, msg16, 'INCORRECT_ID');
            }
          } else if (local_apikey === 'Expired') {
            this.logout(msg12, msg15, 'APIKEY_EXPIRED');
          } else if (local_apikey && !email_link_apikey) {
            this.logout(msg12, msg15, 'LOCALSTORAGE_HAS_NO_APIKEY');
          } else if (local_apikey === email_link_apikey) {
            if (local_oobcode === email_link_oobcode) {
              if (this.$session.get('_email') === this.$route.query.email) this.login();
              else this.logout(msg12, msg16, 'INCORRECT_ID');
            } else {
              this.logout(msg12, msg16, 'INCORRECT_OOBCODE');
            }
          } else {
            this.logout(msg12, msg16, 'INCORRECT_APIKEY');
          }
        } else {
          this.logout(msg12, msg15, 'APIKEY_EXPIRED');
        }
      } else {
        this.logout(msg12, msg16, 'EAMIL_LINK_HAS_NO_APIKEY');
      }
    },
    isEmailAuthenticated: function() {
      console.log('??????isEmailAuthenticated');
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        this.isEmailAuth = true;
        return true;
      } else {
        this.isEmailAuth = false;
        return false;
      }
    },
    signup: function() {
      console.log('??????SIGN UP');
      comm.set_localStorage_with_expiry('_apiKey', this.$route.query.apiKey, 599999);
      comm.set_localStorage_with_expiry('_oobCode', this.$route.query.oobCode, 599999);
      this.flag_email = false;
      this.flag_home_btn = true;
    },
    login: function() {
      this.$session.set('_email', this.$route.query.email);
      console.log('??????LOGIN');
      this.flag_email = false;
      this.flag_home_btn = true;
    },
    logout: function(err_content1, err_content2, msg) {
      console.log(`??????LOGOUT: ${msg}`);
      localStorage.removeItem('_apiKey');
      localStorage.removeItem('_oobCode');
      this.$session.destroy();
      this.popup.err_content1 = err_content1;
      this.popup.err_content2 = err_content2;
      this.popup.alert_flag = true;
      this.flag_email = true;
      this.flag_home_btn = false;
      this.email = '';
    },
    changeLang: function() {
      console.log('??????changeLang');
      let value = this.tmp.filter(item => item.name === this.lang);
      let selectValue = value[0].code;
      this.$i18n.locale = selectValue;
    },
    hovering: function(key) {
      document.querySelectorAll('.pspt, .dls, .govid').forEach(el => (el.firstChild.style.backgroundColor = '#ffffff'));
      document.querySelector(key).firstChild.style.backgroundColor = '#e8efff';
    },
    emailAuthentication: function() {
      localStorage.removeItem('_apiKey');
      localStorage.removeItem('_oobCode');
      this.popup.err_content2 = 'e-mail: ' + this.email;
      // ????????? ????????? ??????
      if (!this.email) this.popup.err_content1 = this.$t('message.step0-5');
      this.email = this.email.trim();
      if (comm.validate('email', this.email) === true) {
        this.$session.set('_email', this.email);
        this.flag_email_btn_click = true;
        this.runEmailTimer();
        this.logoFlag = true;

        return !!this.sendEmail();
      } else {
        this.popup.alert_flag = true;

        return false;
      }
    },
    sendEmail: async function() {
      console.log('??????????sendEmail');
      if (this.isOnline) {
        // const getEmailAuthenticationCode = firebase.app().functions('asia-northeast1').httpsCallable("getEmailAuthenticationCode")
        // let obj = await getEmailAuthenticationCode({email: this.email})
        // this.compareTarget = obj.data.code
        const protocol = location.protocol;
        const hostName = location.hostname;
        const port = location.port;
        const projectId = this.$session.get('_projectId');
        const email = this.$session.get('_email');
        const theme = this.$store.state.isDark;

        if (!projectId || !email) {
          this.popup.err_content1 = this.$t('message.step0-17');
          this.popup.err_content2 = this.$t('message.step0-16');
          this.popup.alert_flag = true;
          const pid = this.$route.query.pid;
          const cid = this.$route.query.email;
          const link =
            protocol + '//' + hostName + (port ? ':' + port : '') + `/main?pid=${pid}&email=${cid}&theme=${theme}`;
          window.location.href = link;

          return;
        }
        const url =
          protocol + '//' + hostName + port
            ? ':' + port
            : '' + `/main?pid=${projectId}&email=${email}&theme=${theme}` + '&emailtime=' + Date.now();

        const actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.
          // url: 'https://www.example.com/finishSignUp?cartId=1234',
          url,
          // This must be true.
          handleCodeInApp: true,
          // dynamicLinkDomain: 'lee-portfolio-add57.web.app',
        };
        let result = await firebase
          .auth()
          .sendSignInLinkToEmail(this.email, actionCodeSettings)
          .then(function() {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            return true;
          })
          .catch(function(error) {
            // Some error occurred, you can inspect the code: error.code
            throw new Error('???' + error);
          });
        // result === 'success' && this.$session.set('_email', this.email)
        return result ? result : false;
        // Confirm the link is a sign-in with email link.
        // this.show_id_selector()
      } else {
        this.popup.err_content1 = this.$t('message.step0-10');
        this.popup.err_content2 = this.$t('message.step0-11');
        this.popup.alert_flag = true;
      }
    },
    setLocation: async function() {
      console.log('??????setLocation');
      const alpha2_Code = await this.searchLocation();
      if (alpha2_Code) {
        this.$store.state.search = this.convert_to_alpha3_code(alpha2_Code);
        this.$store.state.regionCode = true;
      }
    },
    convert_to_alpha3_code(alpha2_code) {
      return countries.alpha2ToAlpha3(alpha2_code);
    },
    searchLocation: function() {
      console.log('??????searchLocation');
      return new Promise(resolve => {
        axios.get('https://ipinfo.io?token=117c9f8816d0ed').then(response => {
          console.log('IP search response', response.data.country);
          this.$store.state.regionCode = true;
          resolve(response.data.country);
        });
      });
    },
    checkAgreement: function() {
      if (!this.agreePersonal) {
        console.log('No Checked Personal Terms');
        window.location.href = '#terms';
        return false;
      } else if (!this.agreePolicy) {
        console.log('No Checked Privacy Policy');
        window.location.href = '#policy';
        return false;
      } else {
        console.log('Confirmed Checking agreements');
        return true;
      }
    },
    show_id_selector() {
      if (!this.flag.login) {
        console.log('validate', comm.validate('email', this.email));
        if (!comm.validate('email', this.email)) {
          console.log('????????? ????????? ???????????? ????????????.');
          this.popup.err_content1 = this.$t('message.step0-25');
          this.popup.err_content2 = this.$t('message.step0-26');
          this.popup.alert_flag = true;
          return;
        }
      }
      // ????????? ??????
      if (this.flag.emailVerification) {
        if (!this.flag.login && !this.flag.signup) {
          // ???????????? ????????? ????????? ????????? ??????
          console.log('??? Executed email authenication!');
          this.emailAuthentication();
          this.$router.push('EmailSending');
          return;
        }
      }
      // ?????? ?????? ?????? ?????? ??????
      // if (!this.checkAgreement()) return;

      let idType = this.GET_TYPE;

      // ????????? ??????
      if (idType) {
        if (idType.acceptPassport) {
          this.psptFlag = true;
        }
        if (idType.acceptDriversLicense) {
          this.dlsFlag = true;
        }
        if (idType.acceptGovernmentId) {
          this.govidFlag = true;
        }
      }
      this.flag_select_box = true;
      this.$refs.group.classList.add('blur-1');
    },
    closeBox() {
      this.$refs.group.classList.remove('blur-1');
      this.flag_select_box = false;
    },
    // enc,
    // dec,
    othersHide() {
      document.querySelector('.uppon_row').classList.add('off');
    },
    // othersShow(){
    //   document.querySelector('.uppon_row').classList.remove('off')
    // },
    // updateValue: function ($event) { //Change user data
    //   if ($event) {
    //     this.email = $event.target.value
    //     this.popup.err_content2 = 'e-mail: '+ $event.target.value
    //   }
    // },
    checkDeviceEnv: function() {
      console.log('??????checkDeviceEnv');
      const device = comm.getDeviceName();
      const browser = comm.getBrowserName();
      this.$store.state.device = device;
      console.log('???? device: ', device);
      console.log('???? browser: ', browser);

      // if(device === "iPhone"){ //iPhone ?????? form3 ??? redirect ??????
      //   let url = 'https://argos-form3.firebaseapp.com/submit?projectId='+this.pid;
      //   if(this.email !== "")
      //     url = url + "&email="+this.email;
      //   window.location.href = url
      // }

      // ???????????? ????????? ???????????? ??????
      if (comm.isMobile(device)) {
        // ???????????? home button ??????
        if (this.$refs.homeBtn) this.$refs.homeBtn.parentNode.classList.remove('off');

        if (device.indexOf('iphone') > -1 || this.$route.query.demo === 'ios') {
          this.$store.state.is_iOS = true;
        }
        return true;
      } else if (!comm.isMobile(device)) {
        this.$store.state.is_iOS = true;
        // if (device.indexOf("win") > -1) {
        this.envError = this.$t('message.step0-8');
        // }else{
        //   this.envError = this.$t("message.step0-9")
        // }
        console.log('???? Not supported media devices');

        return false;
      } else {
        comm.errorPage.call(this, 401);
      }
    },
    URL_add_parameter: function(param, value) {
      let hash = {};
      let parser = document.createElement('a');
      let parameters = parser.search.split(/\?|&/);
      for (let i = 0; i < parameters.length; i++) {
        if (!parameters[i]) continue;
        let ary = parameters[i].split('=');
        hash[ary[0]] = ary[1];
      }
      hash[param] = value;
      let list = [];
      Object.keys(hash).forEach(function(key) {
        list.push('/' + param + '/' + hash[key]);
      });
      return list;
    },
    checkTimeout: function(timestamp, limitedTime) {
      console.log('??????checkTimeout');
      if (timestamp) {
        let curruntTime = Date.now();
        if (curruntTime - timestamp > limitedTime) {
          // ??????????????? 2??? 50??? ?????????
          return false;
        } else {
          return true;
        }
      }
    },
    runEmailTimer: function() {
      console.log('??????runEmailTimer');
      let ms = this.limitedTime;

      let timer = setInterval(() => {
        if (ms < 0) {
          console.log('???? timeout');
          clearInterval(timer);
          this.flag_email_btn_click = false;
        } else {
          this.current_time = moment(ms).format('mm:ss');
        }
        ms -= 1000;
      }, 1000);
    },
    runQRCode: function() {
      console.log('??????runQRCode');
      const protocol = location.protocol;
      const hostName = location.hostname;
      const port = location.port;
      let url =
        protocol +
        '//' +
        hostName +
        (port ? ':' + port : '') +
        `/main?pid=${this.$session.get('_projectId')}&email=${this.$session.get('_email')}&theme=${
          this.$store.state.isDark
        }`;
      /*for(let p in params){
                    url += this.URL_add_parameter(params[p].param, params[p].value)
                  }*/
      url = url + '&qrtime=' + Date.now();

      QRCode.toCanvas(this.qrcode, url, function(error) {
        if (error) console.error(error);
        else console.log('Success!');
      });

      let ms = this.limitedTime;
      const qrTimer = setInterval(() => {
        // console.log(ms)
        if (ms < 0) {
          // this.$refs.timer.classList.add('off')
          clearInterval(qrTimer);
          this.runQRCode();
        } else {
          if (this.$refs.timer) this.$refs.timer.innerHTML = moment(ms).format('mm:ss');
        }
        ms -= 1000;
      }, 1000);
    },
    next_step(selected_id_Type) {
      console.log('??????next_step');
      this.$session.set('_email', this.email); //????????? ????????? ???????????????.
      this.$store.state.type = selected_id_Type;

      switch (selected_id_Type) {
        case 'passport':
          this.$store.state.titleType = this.$t('message.type1');
          break;
        case 'driver_license':
          this.$store.state.titleType = this.$t('message.type2');
          break;
        case 'government_ID':
          this.$store.state.titleType = this.$t('message.type3');
          break;
      }
      this.$router.push('SelectIssueCountry');
    },
    // noCam() {
    //   console.log('no cam')
    //   this.$router.push({name:'Step1-1'})
    // },
  },
  destroyed() {
    console.log('destroyed');
  },
};
