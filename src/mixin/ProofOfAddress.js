import comm from './common';
import * as DTO from '@/model/DataObject';
import { mapActions, mapGetters } from 'vuex';

export const ProofOfAddress = {
  data() {
    return {
      formdata: {},
      countryValue: this.$store.state.Issue_country_name ? this.$store.state.Issue_country_name : '',
      addressString: this.$t('message.address1-4'),
      input0: this.$t('message.address1-12'),
      input1: this.$t('message.address1-5'),
      input2: this.$t('message.address1-6'),
      input3: this.$t('message.address1-7'),
      input4: this.$t('message.address1-8'),
      input5: this.$t('message.address1-9'),
      input6: this.$t('message.address1-10'),
      input7: this.$t('message.address1-13'),
      input8: this.$t('message.address1-14'),
      input9: this.$t('message.address1-15'),
      input10: this.$t('message.address1-16'),
      input11: this.$t('message.address1-17'),
      input12: this.$t('message.address1-18'),

      submitBtn: this.$t('message.address1-11'),

      orientation: 0,
    };
  },
  created: function() {},
  async mounted() {
    console.log('%c' + '🔥🔥🔥🔥🔥 Proof of address 🔥🔥🔥🔥🔥', 'color:green;font-weight:bold;');
    // comm.inspectSession(this);
    // 가로화면 세팅
    this.orientation = window.orientation;
    // document.onclick = function() {
    //   this.orientation = window.orientation;
    // };

    document.querySelector('.form-wrapper').style.width = window.innerWidth + 'px';
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
  },
  computed: {
    ...mapGetters('dataset', ['GET_DS_PARAMS']),
  },
  methods: {
    ...mapActions('dataset', ['ACT_ADDR_PARAMS', 'ACT_ADDR_IMAGE']),
    onResize() {
      let x = window.innerWidth;
      let y = window.innerHeight;
      if (x > y) {
        this.resizeFlag = 'horizontal';
      } else {
        this.resizeFlag = 'vertical';
      }
    },
    backBtn() {
      if (this.$session.exists()) {
        this.$router.push('TakeFacePhoto');
      } else {
        window.location.href = 'https://argos-solutions.io/ko/';
      }
    },
    addressRule({ value }) {
      if (Array.isArray(value)) {
        const [address] = value;
        // if(parseInt(address.zipcode))
        //   if(address.zipcode.length >= 6)
        //      address.zipcode = parseInt(address.zipcode)

        return address.street && address.city && address.country && address.state && address.zipcode;
      }
      return false;
    },
    test(key) {
      let tagbox = document.querySelector(`#${key}`);
      if (tagbox) tagbox.style.border = '1px solid #cecece';
    },
    addressMessage({ value }) {
      if (Array.isArray(value)) {
        const [address] = value;
        const missing = ['Street', 'City', 'Country', 'State', 'Zipcode'].reduce((missing, field) => {
          if (!address[field]) {
            missing.push(field);
            document.querySelector(`#${field}`).style.border = '1px solid red';
          } else {
            document.querySelector(`#${field}`).style.border = '1px solid #cecece';
          }
          return missing;
        }, []);
        // console.log(this.$t("message.address1-2") + missing.join(", "));
        console.log('missing', missing);
        // return this.$t("message.address1-2") + missing.join(', ')
      }
      // return this.$t("message.address1-3")
    },
    submit() {
      console.log('✔️submit');
      let self = this;
      let c1 = self.$refs.canvas;
      let ctx = self.$refs.canvas.getContext('2d');
      let dataset, params;
      let addrObj = this.formdata[Object.keys(this.formdata)[0]][0];
      let fileObj = this.formdata[Object.keys(this.formdata)[0]][0][this.input12].fileList[0];
      let img = new Image();
      img.src = URL.createObjectURL(fileObj);

      let readImage = new Promise(function(resolve) {
        img.onload = function() {
          let w, h, rate;
          let img_w = img.width;
          let img_h = img.height;
          let screenRate = (window.innerWidth * 0.85) / img_w;

          rate = 1 - img_h / img_w;
          console.log('비율:', rate);
          w = img_w * screenRate;
          h = w - w * rate;

          c1.width = w;
          c1.height = h;
          c1.style.width = c1.width + 'px';
          c1.style.height = c1.height + 'px';

          ctx.drawImage(img, 0, 0, c1.width, c1.height);

          return resolve(c1.toDataURL('image/png'));
        };
      });
      readImage.then(function(addressImage) {
        console.log('addrObj', addrObj);
        dataset = new DTO.Dataset(addrObj);
        console.log('dataset', dataset);
        params = new DTO.DatasetParams(dataset);
        let params2 = new DTO.DatasetParams({
          addressImage: addressImage,
        });
        // //combine face image to Dataset instance
        self.ACT_ADDR_PARAMS(params.getAddress);
        self.ACT_ADDR_IMAGE(params2.getAddressImage);

        console.log('GET_DS_PARAMS', self.GET_DS_PARAMS);
        console.log('getAddress', self.GET_DS_PARAMS.getAddress());
        // console.log('GET_DS_PARAMS', self.GET_DS_PARAMS.getAddress())
        // console.log('GET_DS_PARAMS', self.GET_DS_PARAMS.getAddressImage())

        self.$router.push('SubmitKyc');
        // self.$router.push({ name: "Step4", params: {} });
      });

      // let toBase64_img = new Promise( function (resolve, reject) {
      //   let reader = new FileReader()
      //   reader.readAsDataURL(fileObj);

      //   reader.onload = function () {
      //     // console.log(reader.result)
      //     self.$refs.canvas.src = reader.result
      //     // ctx.drawImage(fileObj, 0, 0, fileObj.width, fileObj.height)

      //     console.log(self.$refs.canvas.srcObject)

      //     return resolve(reader.result)
      //   }
      //   reader.onerror = function (error) {
      //     console.log('Error: ', error)
      //     reject(error)
      //   }
      // })
      // toBase64_img.then(function(result){
      //   dataset = new DTO.Dataset(addrObj, result)
      //   params = new DTO.DatasetParams(dataset)
      //   // //combine face image to Dataset instance
      //   self.$store.state.ds_params.getAddress = params.getAddress
      //   self.$store.state.ds_params.getAddressImage = params.getAddressImage
      //   console.log('self.$store.state.ds_params.getAddressImage', self.$store.state.ds_params.getAddressImage())

      //   // self.$router.push({name: "Step4", params: {}})
      // })
    },
  },
};
