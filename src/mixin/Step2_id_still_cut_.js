import { setTimeout } from "timers";
import { setIDTypeRate } from "../helpers/setUI";
import comm from "./common";
import { playWebcam } from "./webcam/playWebcam";
import { autoCapture } from "./webcam/autoCapturing";
import { playLocalCam } from "./webcam/playLocalCam";
import * as DTO from "@/model/DataObject";
import { mapActions, mapGetters } from "vuex";

export const Step2_id_still_cut_ = {
    data() {
        return {
            stepType: "id",
            step: 2,
            ID_type_Rate: null,
            fullscreen: false,
            orientation: 0,
            resizeFlag: "vertical",
            //--Device info
            nocam: null,
            error: "",
            deviceId: null,
            divice: null,
            devices: [],
            browser: null,
            loading: true,
            //--Video
            runVideo: false,
            video: null,
            recVideo: null,
            // ml5: ml5,
            btn_flag: false,
            classifier: null,
            predictions: [],
            status: "",
            //--Auto focus
            x_rate_min: 0,
            x_rate_max: 0,
            y_rate_min: 0,
            y_rate_max: 0,
            min_width: 0,
            max_width: 0,
            min_height: 0,
            max_height: 0,
            width_id: 0,
            height_id: 0,
            isPerson: false,
            isIdentityDocument: false,
            isFace: false,
            resFaceDetect: false,
            resIdentityDocumentDetect: false,
            //--image binary File
            hasFrontImg: false,
            hasBackImg: false,
            croppedImagebinary: "",
            flash: false,
            //--canvas
            width_1280: 1280,
            c1: null,
            c2: null,
            ctx: null,
            image: null,
            imgObj: { img_front: "", img_back: "" },
            //--flag
            action: false,
            sideOfId: "",
            failcnt: 0,
            //--Alert
            popup: {
                alert_flag: false,
                err_content1: "",
                err_content2: "",
            },
            //--Privacy info
            Issue_country_name: this.$store.state.Issue_country_name ?
                this.$store.state.Issue_country_name : "",
            Issue_country_code: this.$store.state.Issue_country_code ?
                this.$store.state.Issue_country_code : "",
            idType: null,
            ID_label: null,
            tmpId: null,
            pid: null,
            email: null,
            // recData: null,
            sign: {
                computFrame: true,
                capture: false,
            },
            uiflag: {
                photo_area: false,
                edgeLayer: false,
                video: false,
                localCam: false,
                sample: true,
                passport: false,
                success: false,
                photo_box: true,
                next_btn: false,
                retry_btn: false,
                shot_btn: false,
                canvas: false,
            },
            queryImage: false,
            license_img: require("@/assets/static/img/license_img.png"),

            timeout: "",

            cnt: 0,

            today: "",
            tot: 0,
            progress: 0,
            isData: false,

            onvideo: true,
        };
    },
    create: function() {
        // 실패 횟수를 카운팅한다.
        // this.failcnt = self.$session.get("_failCnt");
        this.browser = comm.isBrowserCheck();
    },
    async mounted() {
        console.log(
            "%c" + "🔥🔥🔥🔥🔥 STEP 2 ID still cut 🔥🔥🔥🔥🔥",
            "color:blue;font-weight:bold;"
        );
        this.sideOfId = this.$t("message.step2-7");
        comm.inspectSession(this);

        // 가로화면 세팅
        this.orientation = window.orientation;
        // document.onclick = function() {
        //   this.orientation = window.orientation;
        // };
        let device = this.$store.state.device;

        console.log("device", device);

        if (!device) return;

        // 캡쳐 버튼 활성화 분기
        if (this.$store.state.is_iOS) {
            this.uiflag.sample = true;
            this.uiflag.shot_btn = false;
        } else if (this.$store.state.ver === "automatic") {
            this.uiflag.sample = false;
            this.uiflag.shot_btn = true;
            this.showBtnTimer();
        } else {
            this.uiflag.sample = false;
            this.uiflag.shot_btn = true;
            this.onButton();
        }

        this.video = this.$refs.video;
        this.c1 = this.$refs.canvas;
        // this.c2 = this.$refs.canvas_box;

        this.idType = this.$store.state.type;
        this.ID_label = this.$store.state.label;

        if (this.idType && this.Issue_country_code) {
            this.isData = true;
        } else {
            this.isData = false;
            comm.errorPage(this, 401);
        }
        // this.$session.set("_q3", dec(localStorage.getItem("_digitus"), 3))
        this.ctx = this.c1.getContext("2d");

        console.log("ID type rate에 따른 RGB 감지 프레임 적용");
        this.setIDTypeRate(this.idType);
        let screen = this.$refs.screen;
        let viewportRatio = 0.5;
        if (window.orientation === 0) {
            this.width_id = screen.offsetWidth * 0.85;
            this.height_id = screen.offsetWidth * 0.85 * this.ID_type_Rate;
        } else {
            this.width_id = screen.offsetWidth * viewportRatio * 0.85;
            this.height_id =
                screen.offsetWidth * viewportRatio * 0.85 * this.ID_type_Rate;
        }
        this.video.width = this.width_id;
        this.video.height = this.height_id;
        this.$refs.localCam.style.width = this.width_id + "px";
        this.$refs.localCam.style.height = this.height_id + "px";

        if (this.$store.state.ver === "automatic" && !this.$store.state.is_iOS) {
            this.uiflag.edgeLayer = true;
            this.$refs.edgeLayer.style.height = this.height_id + "px";
            this.$refs.edgeLayer.style.width = this.width_id + "px";
        }
        this.$refs.canvas.width = this.width_id;
        this.$refs.canvas.height = this.height_id;
        this.$refs.canvas.style.width = this.width_id + "px";
        this.$refs.canvas.style.height = this.height_id + "px";

        // passport layer
        if (this.idType === "passport") {
            this.$refs.passport.style.width = this.width_id;
            this.uiflag.passport = true;
        }

        if (this.$store.state.ver !== "automatic")
            this.$store.state.isIdentityDocument = true;

        this.$store.state.is_iOS || (await this.playWebcam(this, "id"));
        this.$store.state.is_iOS && this.playLocalCam(this);
        this.$store.state.is_iOS ||
            (this.$store.state.ver === "automatic" && this.autoCapture(this));
    },
    watch: {
        resizeFlag: function() {
            console.log("✔️resizeFlag");
            // this.video.pause();
            // comm.stopStreamedVideo(this.video);

            if (this.resizeFlag === "horizontal") {
                console.log("가로모드 실행");
                this.orientation = window.orientation;
            } else {
                console.log("세로모드 실행");
                this.orientation = window.orientation;
            }
            if (!this.sign.capture)
                if (!this.$store.state.is_iOS) {
                    // this.video.play();
                    this.sign.computFrame = false;
                    this.playWebcam(this);
                    // this.video.load()
                }
        },
        orientation: function() {
            switch (window.orientation) {
                case 0:
                    comm.viewportZoomset(1.0, 1.0, 1.0);
                    break;
                    //In case of orientation was 90 or -90 or 180 or -180
                default:
                    comm.viewportZoomset(0.5, 0.5, 0.5);
                    if (this.uiflag.passport === true) {
                        this.$refs.passport.style.maxWidth = this.width_id + "px";
                        this.$refs.passport.style.maxHeight = this.height_id + "px";
                    }
                    break;
            }
        },
        resFaceDetect: function() {
            // this.capture()
            console.log("Face has been verified");
        },
        resIdentityDocumentDetect: function() {
            if (this.hasFrontImg === true && this.hasBackImg === true) {
                throw new Error("⛔" + "3번 이상 찍힘");
            }
            if (this.sign.capture === true) {
                console.log("Identity document has been verified");
                this.capture();
                // this.resIdentityDocumentDetect = false
            }
        },
    },
    computed: {
        ...mapGetters("dataset", ["GET_DS_PARAMS"]),
    },
    methods: {
        ...mapActions("dataset", ["ACT_DS_PARAMS"]),
        setIDTypeRate,
        playWebcam,
        autoCapture,
        playLocalCam,
        // runCrop,
        // processing,
        // typingTool,
        // dec,
        onResize() {
            let x = window.innerWidth;
            let y = window.innerHeight;
            if (x > y) {
                this.resizeFlag = "horizontal";
            } else {
                this.resizeFlag = "vertical";
            }
        },
        close_alert() {
            console.log("✔️close_alert");
            this.popup.alert_flag = false;
            this.retry();
        },
        showBtnTimer: function() {
            console.log("✔️showBtnTimer");
            let i = 0;
            let count = this.$store.state.ver === "automatic" ? 5 : 0;

            let time_out = window.setInterval(async() => {
                console.log(i++, this.sign.capture);
                // if(i >= 5 || this.sign.capture === true)
                console.log(this.sign.capture);
                if (i >= count || this.sign.capture === true) {
                    this.onButton();

                    window.clearInterval(time_out);
                }
            }, 1000);
        },
        onButton() {
            console.log("✔️onButton");
            this.btn_flag = true;
            this.shot_btn = true;
            if (this.$refs.shotBtn)
                this.$refs.shotBtn.classList.remove("opacity");
        },
        offButton() {
            console.log("✔️offButton");
            this.btn_flag = false;
            this.shot_btn = true;
            if (this.$refs.shotBtn)
                this.$refs.shotBtn.classList.add("opacity");
        },
        onVideo() {
            console.log("✔️onVideo");
            this.loading = false;
            this.uiflag.video = true;
            this.uiflag.photo_area = true;
        },
        onLocalcam() {
            console.log("✔️onLocalcam");
            this.loading = false;
            this.uiflag.video = false;
            this.btn_flag = true;
            this.uiflag.localCam = true;
            this.uiflag.photo_area = true;
        },
        next_step: async function() {
            console.log("✔️next_step");
            if (this.$store.state.ver !== "automatic")
                this.$store.state.isIdentityDocument = true;
            //check is ID Document in the captured stream
            console.log("⭐isIdentityDocument");
            if (this.$store.state.isIdentityDocument === false) {
                this.popup.err_content1 = this.$t("message.step2-1");
                this.popup.err_content2 = this.$t("message.step2-2");
                this.popup.alert_flag = true;
                return
            }
            this.alert_flag = false;
            // // 제출 버튼 클릭시 버튼 비활성화
            // document.querySelector('.text_box').firstChild.disabled = true
            /****** Prevent CSRF *****
            this.$session.set("_q5", dec(localStorage.getItem("_digitus"), 5))
      
            let qa = +this.$session.get("_q0")
                    +this.$session.get("_q1")
                    +this.$session.get("_q2")
                    +this.$session.get("_q3")
                    +this.$session.get("_q4")
                    +this.$session.get("_q5") * 1
      
            const _digitus = localStorage.getItem("_digitus") * 1

            console.log(_digitus+', '+qa)
            if(_digitus !== qa){
              localStorage.removeItem('_digitus')
              comm.errorPage(this, "Step2", `Invalid user`, "Error", 401)
            }
            this.loading = true  //loading...
            /******/
            console.info(
                "In case of Passport, do not take photos of the back side && no Backside Image"
            );
            if (
                // 신분증 뒷면 촬영시 임시 분기조건
                this.Issue_country_code !== "KOR" &&
                this.idType !== "passport" &&
                this.hasFrontImg === true &&
                this.hasBackImg === false
            ) {
                console.log("Go Backside");
                if (this.$store.state.is_iOS) {
                    this.$refs.queryImage.classList.add("off");
                    this.$refs.localCam.style.height = this.height_id + "px";
                }
                this.sideOfId = this.$t("message.step2-8");
                this.retry(true);
            } else {
                this.loading = true;

                let params = new DTO.DatasetParams({
                    userid: this.$session.get("userid"),
                    retryCounter: this.failCnt,
                    projectId: this.$session.get("_projectId"),
                    issuingCountry: this.Issue_country_code ?
                        this.Issue_country_code : "",
                    idType: this.idType ? this.idType : "",
                    idImage: this.imgObj ? this.imgObj : "",
                    email: this.$session.get("_email"),
                });

                // Face check 결과에 따른 프로세스 결정
                // if (this.$store.state.facecheckObj) {
                //   if (this.$store.state.facecheckObj.faceCheckResult) {
                //     if (this.$store.state.facecheckObj.faceCheckResult === "pass") {
                //       this.$router.push({ name: "Step4" });
                //     } else {
                //       this.$router.push({ name: "Step3" });
                //     }
                //   } else {
                //     this.$router.push({ name: "Step3" });
                //   }
                // } else {
                console.log(":::::::::::::: ID Input Object ::::::::::::::");
                console.log("ID 데이터셋을 vuex store에 담았습니다.");
                this.ACT_DS_PARAMS(params);
                // console.log("GET_DS_PARAMS", this.GET_DS_PARAMS);

                let screen = this.$refs.screen;
                screen.classList.remove("fadein");
                screen.classList.add("fadeout");

                // setTimeout(() => {
                this.$router.push('FaceStillcut');
                // },3000)
                // }
                // const lmtAge = this.$store.state.LMT_AGE ? this.$store.state.LMT_AGE : 0; console.log('lmtAge ',  lmtAge)
                comm.stopStreamedVideo(this.video);
            }
        },
        // close: function() {
        //   this.popup.alert_flag = false;
        //   this.$router.push(
        //     `/v2/pid/${this.$session.get("_projectId")}/cid/${this.$session.get(
        //       "_email"
        //     )}/theme/${this.$store.state.isDark}`
        //   );
        // },
        capture: function() {
            console.log("✔️📷 capture!");
            let self = this;
            if (self.btn_flag === false) return;

            this.uiflag.photo_box = false;
            self.uiflag.retry_btn = true;
            self.sign.capture = true;
            self.flash = false;
            self.isPerson = false;
            self.$store.state.self = self;
            // self.$session.set("_q4", dec(localStorage.getItem("_digitus"), 4))
            self.uiflag.next_btn = true;

            if (!self.$store.state.is_iOS)
                self.image = self.c1.toDataURL("image/png");

            if (self.hasFrontImg === false && self.hasBackImg === false) {
                self.imgObj.img_front = self.image;
                self.hasFrontImg = true;

                // save query Image for face comparing
                self.$store.state.queryImage = self.$refs.queryImage;
            } else if (self.hasFrontImg === true && self.hasBackImg === false) {
                self.imgObj.img_back = self.image;
                self.hasBackImg = true;
            } else if (self.hasFrontImg === true && self.hasBackImg === true) {
                return;
            } else {
                return;
            }

            if (self.$store.state.is_iOS) {
                if (
                    self.Issue_country_code !== "KOR" &&
                    self.idType !== "passport" && // 신분증 뒷면 촬영시 임시 분기조건
                    self.hasFrontImg === false &&
                    self.hasBackImg === false
                )
                    self.$refs.localCam.style.height =
                    self.$refs.queryImage.offsetWidth + "px";

                self.uiflag.canvas = true;
            } else {
                self.video.pause();
                this.onvideo = false;

                this.uiflag.video = false; //비디오 숨김
                self.uiflag.next_btn = true;
                self.uiflag.canvas = true;
            }

            let successWrap = self.$refs.successed_wrap;
            // Flash effect of success button
            this.t1 = setTimeout(() => {
                self.uiflag.success = true;
                this.t2 = setTimeout(() => {
                    if (successWrap) successWrap.classList.add("fadeout");
                    this.t3 = setTimeout(() => {
                        self.uiflag.success = false;
                    }, 300);
                }, 600);
            }, 300);
            clearTimeout(this.t1);
            clearTimeout(this.t2);
            clearTimeout(this.t3);
        },
        retry: function(clear_temp_image) {
            console.log("✔️retry");
            let self = this;
            self.resIdentityDocumentDetect = false;
            self.$store.state.isIdentityDocument = false;
            self.btn_flag = false;

            if (!self.$store.state.is_iOS) {
                this.offButton();
                self.showBtnTimer();
                self.video.play();
                this.onvideo = true;
                // comm.stopStreamedVideo(this.video);
                // this.playWebcam(this);

                this.uiflag.video = true;
                this.uiflag.photo_box = true;
            } else {
                self.btn_flag = true;
            }
            if (self.$store.state.is_iOS) {
                this.uiflag.sample = true;
                this.uiflag.photo_box = true;
            }

            self.uiflag.canvas = false;

            self.uiflag.next_btn = false;
            self.uiflag.retry_btn = false;

            self.tot = 0;
            self.sign.capture = false;
            // self.playWebcam(self)

            //clear temporary Image data
            if (clear_temp_image !== true) {
                if (self.hasFrontImg === true && self.hasBackImg === false) {
                    console.log("Retry Front shot");
                    self.hasFrontImg = false;
                    self.imgObj.img_front = "";
                    self.sideOfId = this.$t("message.step2-7");
                } else if (self.hasFrontImg === true && self.hasBackImg === true) {
                    console.log("Retry Back shot");
                    self.hasBackImg = false;
                    self.imgObj.img_back = "";
                    self.sideOfId = this.$t("message.step2-8");
                } else {
                    self.hasFrontImg = false;
                    self.hasBackImg = false;
                    self.imgObj = "";
                }
            }
        },
        backBtn: function() {
            console.log("✔️backBtn");
            this.video.pause();
            this.onvideo = false;
            comm.stopStreamedVideo(this.video);
            if (this.$session.exists()) {
                this.$router.push('SelectIssueCountry');
            } else {
                window.location.href = "https://argos-solutions.io/ko/";
            }
        },
    },
};