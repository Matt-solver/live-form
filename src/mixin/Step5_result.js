import comm from "./common";

export const Step5_result = {
  data() {
    return {
      error: false,
      resultText1: "",
      resultText2: "",
      step: 4,
      text: "Thank you for submit your KYC",
      linkFlag: false,
      linkAddr: "",
      failcnt: 0,
      btnText: "Return to website",

      orientation: 0,
      resizeFlag: 'vertical',
    };
  },
  create: function() {
    this.failcnt = this.$session.get("_failCnt");
  },
  async mounted() {
    console.log("%c"+"🔥🔥🔥🔥🔥 STEP 5 Result 🔥🔥🔥🔥🔥", "color:blue;font-weight:bold;");

    let self = this;
    // comm.inspectSession(self);

    // 가로화면 세팅
    self.orientation = window.orientation;
    // document.onclick = function() {
    //   self.orientation = window.orientation;
    // };

    // 연결링크
    let connectionLink = this.$store.getters["optionStore/GET_CONNECTION_LINK"];
    if (connectionLink) {
      self.linkFlag = true;
      self.linkAddr = connectionLink;
    }

    // KYC 결과 데이터 처리
    let rs_params = self.$route.params.rs_params;
    if (rs_params) {
      if (rs_params.data) {
        if (rs_params.data.output !== undefined) {
          if (rs_params.data.output.toString() === "approved") {
            self.resultText1 = this.$t("message.step5-2");
            self.dataClear()
          } else {
            self.resultText1 = this.$t("message.step5-3");
            self.resultText2 = this.$t("message.step5-4");
            self.dataClear();
          }
        } else {
          self.resultText1 = this.$t("message.step5-3");
          self.resultText2 = this.$t("message.step5-4");
          self.dataClear();
        }
      } else {
        self.resultText1 = this.$t("message.step5-3");
        self.resultText2 = this.$t("message.step5-4");
        self.dataClear();
      }
    } else {
      self.resultText1 = this.$t("message.step5-3");
      self.resultText2 = this.$t("message.step5-4");
      self.dataClear();
    }
    // if(rs_params){
    //   if(rs_params.data){
    //     if(rs_params.data.output !== undefined){
    //       if(rs_params.data.output.toString() === "approved"){
    //         self.resultText1 = this.$t("message.step5-2");
    //         //self.dataClear()

    //       }else if(rs_params.data.output.toString() === "complete"){
    //         self.resultText1 = this.$t("message.step5-3")
    //         self.resultText2 = this.$t("message.step5-4")
    //         //self.dataClear()

    //       } else { this.errorHandler() }
    //     } else { this.errorHandler() }
    //   } else { this.errorHandler() }
    // } else { this.errorHandler() }
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
      console.log("✔️resizeFlag")
      if(this.resizeFlag === 'horizontal'){
        console.log('가로모드 실행')
        this.orientation = window.orientation;
      }else{
        console.log('세로모드 실행')
        this.orientation = window.orientation;
      }
    }
  },
  methods: {
    onResize() {
      let x = window.innerWidth;
      let y = window.innerHeight;
      if(x>y){
        this.resizeFlag = 'horizontal'
      } else {
        this.resizeFlag = 'vertical'
      }
    },
    go_Linked_page: function() {
      window.location.href = this.linkAddr;
    },
    goHome: function() {
      this.$router.push(
        `/main?pid=${this.$session.get("_projectId")}&email=${this.$session.get(
          "_email"
        )}&theme=${
          this.$store.state.isDark
        }&apiKey=${comm.get_localStorage_with_expiry(
          "_apiKey"
        )}&oobCode=${comm.get_localStorage_with_expiry("_oobCode")}&mode=signIn`
      );
    },
    // doException: function(value) {
    //   console.log( `${value} check Exception start..` )
    //   if(value){
    //     if(value.status === 200) {
    //         if(value === "pass") {
    //           return true

    //         } else if (value === "fail"){
    //           return false

    //         } else { return false }
    //     }else{ return }

    //   }else{ return false }

    // },
    dataClear: function() {
      console.log("✔️dataClear")
      this.$session.destroy();
      this.$store.replaceState({});
    },
    errorHandler: function() {
      let self = this;
      self.error = true;
      self.resultText1 = this.$t("message.step5-5");
      self.btnText = this.$t("message.step5-6");
      // this.$router.push(`/main?pid=${this.$session.get("_projectId")}&email=${this.$session.get("_email")}&theme=${this.$store.state.isDark}&apiKey=${comm.get_localStorage_with_expiry('_apiKey')}&oobCode=${comm.get_localStorage_with_expiry('_oobCode')}&mode=signIn`);
    },
    backBtn() {
      if (this.$session.exists()) {
        this.$router.push('IdStillCut');
      } else {
        window.location.href = "https://argos-solutions.io/ko/";
      }
    },
  },
};
