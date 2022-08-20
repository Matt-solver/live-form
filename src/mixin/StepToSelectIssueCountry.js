import comm from './common';
import nation from '@/helpers/country';
import { mapGetters } from 'vuex';

export const StepToSelectIssueCountry = {
  data() {
    return {
      popup: {
        alert_flag: false,
        err_content1: '',
        err_content2: '',
      },
      placeholder: null,
      regionCode: this.$store.state.regionCode ? this.$store.state.regionCode : false,
      search: this.$store.state.search ? this.$store.state.search : '',
      searchText: '',
      autoUpdate: true,
      isUpdating: false,
      nation: [],
      imgPath: '../../assets/country/',
      country: nation,
      typingText: ' Select your Issue country.',
      title: '',
      chevron: '',
      list0: '',
      type: '',

      orientation: 0,
      resizeFlag: 'vertical',
    };
  },
  async mounted() {
    console.log('%c' + '🔥🔥🔥🔥🔥 STEP 1 Select Issuing country 🔥🔥🔥🔥🔥', 'color:blue;font-weight:bold;');

    let self = this;
    // comm.inspectSession(self);
    this.onUserCountry();

    // 가로화면 세팅
    self.orientation = window.orientation;
    // document.onclick = function() {
    //   self.orientation = window.orientation;
    // };
    this.placeholder = this.$t('message.step1-4');

    if (!this.$store.state.type) comm.errorPage.call(this, 401);

    this.title = document.querySelector('.ttl');
    this.chevron = document.querySelector('.chevron');
    this.list0 = document.querySelector('.list0');
    console.log('this.regionCode', this.$store.state.regionCode);
    console.log('this.search', this.search);

    // ADD Black-List Countries(Defalut: "North Korea, Iran)"
    if (this.$store.state.LMT_country && this.country) {
      const blacklist = this.GET_BLACKLIST_COUNTRIES; // 블랙리스트 추가할 항목들
      const all_country = this.country; // 전체 국가 리스트
      for (let i in blacklist) {
        for (let j in all_country) {
          if (blacklist[i] == all_country[j].value) {
            all_country[j].status = false; //전제 국가 리스트에서 접근 금지국가로 설정됨
          }
        }
      }
      this.country = all_country;
    }
  },
  beforeUpdate() {
    //   if (this.regionCode === true) {
    //     this.list0.classList.add("primary");
    //     this.title.classList.add("white--text");
    //   }
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
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000);
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
    ...mapGetters('optionStore', ['GET_BLACKLIST_COUNTRIES']),
    //Print of issuing country list
    filteredList() {
      let self = this;
      // if (self.chevron) {
      //   self.chevron.classList.remove("theme--dark");
      //   self.chevron.classList.add("theme--light");
      // }
      if (self.regionCode === true) {
        return self.country.filter(item => {
          // Search with county code
          return item.value.toLowerCase().includes(self.search.toLowerCase());
        });
      } else {
        let filteredCountry = self.country.filter(item => {
          console.log(self.search);
          // 국가명으로 검색
          self.regionCode = false;
          if (document.querySelector('.ttl')) document.querySelector('.ttl').classList.remove('white--text');
          return (
            item.label.toLowerCase().includes(self.search.toLowerCase()) ||
            item.value.toLowerCase().includes(self.search.toLowerCase())
          );
        });

        return filteredCountry;
      }
    },
  },
  methods: {
    // typingTool,
    // dec,
    onUserCountry() {
      let itemArr = document.querySelectorAll('.country_list');
      itemArr[0].classList.add('on');
    },
    onListEvent(item) {
      let itemArr = document.querySelectorAll('.country_list');
      for (let item of itemArr) {
        item.addEventListener('click', function() {
          for (let item of itemArr) {
            item.classList.remove('on');
          }
          item.classList.add('on');
        });
      }
      if (item) this.next_step(item.label, item.value, item.status);
    },
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
    next_step(label, code, status) {
      console.log('✔️next_step');
      if (status === false) {
        this.popup.err_content1 = this.$t('message.step1-1');
        this.popup.err_content2 = this.$t('message.step1-2') + label;
        this.popup.alert_flag = true;
      } else {
        // this.$session.set("_q2", dec(localStorage.getItem("_digitus"), 2));
        this.e1++;
        this.$store.state.Issue_country_name = label;
        this.$store.state.Issue_country_code = code;

        document.querySelector('.screen').classList.remove('fadein');
        document.querySelector('.screen').classList.add('fadeout');

        // setTimeout(() => {
        this.$router.push('TakeIdPhoto');
        // }, 3000)
      }
    },
    // remove (item) {
    remove() {
      // const index = this.nation.indexOf(item.value)
      // if (index >= 0) this.nation.splice(index, 1)
      this.nation = null;
    },
    convert_label_search() {
      this.search = '';
      this.regionCode = false;
      // if (this.chevron) {
      //   this.chevron.classList.remove("theme--dark");
      //   this.chevron.classList.add("theme--light");
      // }
      // if (this.list0.classList.contains("primary"))
      //   this.list0.classList.remove("primary");
    },
    backBtn: async function() {
      if (this.$session.exists()) {
        // window.history.go(0)
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
