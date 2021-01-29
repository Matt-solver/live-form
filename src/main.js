import Vue from "vue";
import { config } from "./helpers/firebaseConfig.js";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import "@babel/polyfill";
import "@mdi/font/css/materialdesignicons.css";
import VueFormulate from "@braid/vue-formulate";
import VueSession from "vue-session";
import VueMoment from "vue-moment";
import firebase from "firebase/app";
import "firebase/functions";
import * as ml5 from "ml5";
import * as faceapi from "face-api.js";
import VueI18n from "vue-i18n";
import ko from "./assets/lang/ko.json";
import en from "./assets/lang/en.json";
import es from "./assets/lang/es.json";
import pt from "./assets/lang/pt.json";
import vn from "./assets/lang/vn.json";
import cn from "./assets/lang/cn.json";
import jp from "./assets/lang/jp.json";
import FirstPlugin from "./plugins/my-plugin";
Vue.use(FirstPlugin);

/*** Define Session ***/
let sessionOptions = {
  persist: true,
};
Vue.use(VueSession, sessionOptions);
/******/

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false;
Vue.use(VueMoment);
Vue.use(VueI18n);

// Our first plugin
function myFirstPlugin(instance) {
  // Add a new validation rule
  instance.extend({
    rules: {
      foobar: ({ value }) => ["foo", "bar"].includes(value),
    },
  });
}

const messages = {
  en: { message: en },
  ko: { message: ko },
  es: { message: es },
  pt: { message: pt },
  vn: { message: vn },
  cn: { message: cn },
  jp: { message: jp },
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: "en", // set locale
  messages, // set locale messages
});

Vue.use(VueFormulate, {
  plugins: [myFirstPlugin],
  uploader: function(file, progress) {
    // optionally handle the `file` for your own purposes here...
    progress(100);
    return Promise.resolve({});
  },
});

// AI modules
store.state.ml5 = ml5;
store.state.faceapi = faceapi;

new Vue({
  i18n,
  data() {
    return {
      msg: "Started Live-form..",
    };
  },
  async created() {
    if (this.$route.path !== "/main/SelectIdType") {
      let path = "/main";
      if (this.$session.exists()) {
        let projectId = this.$session.get("_projectId");
        let email = this.$session.get("_email");
        let theme = this.$session.get("_theme");
        path =
          path + "/SelectIdType?pid=" + projectId + "&email=" + email + "&theme=" + theme;
      }
      await this.$router.push({ path: path });
    }
    firebase.initializeApp(config);
    //firebase.functions().useFunctionsEmulator("http://localhost:5001");
  },
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
