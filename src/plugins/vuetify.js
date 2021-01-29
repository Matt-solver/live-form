import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#1976d2",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#ed6d6d",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        disabled: "#cdcdcd",
      },
    },
  },
});
