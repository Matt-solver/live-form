import Vue from "vue";
import Vuex from "vuex";
import optionStore from "./optionStore";
import dataset from "./dataset";
import languageObject from "@/helpers/languageObject.json";

Vue.use(Vuex);

const store = new Vuex.Store({
  //Step 4-2 KYC 완료 Status
  state: {
    self: null,
    isFace: false,
    is_iOS: false,
    progressValue: 0,
    queryImage: null,
    info_massage: null,
    submitResult: null,
    resFaceDetect: false,
    input_params_LiveKYC: null,
    idcheckObj: null,
    facecheckObj: null,
    //session data
    projectId: null,
    email: null,
    //intent to
    iscam: false,
    Issue_country_name: null,
    Issue_country_code: null,
    label: null,
    type: null,
    tmpId: null,
    //get custom options
    LMT_AGE: 0,
    LMT_country: ["PRK", "IRI"],
    connectionLink: null,
    isDark: false,
    search: null,
    regionCode: null,
    ds_params: {},
    isPerson: false,
    isIdentityDocument: false,
    kycLevel: null,
    titleType: "",
    language: languageObject,
  },
  modules: {
    optionStore: optionStore,
    dataset: dataset,
  },
  getters: {
    // GET_PROGRESSS_VALUE: state => state
  },
  muatitons: {
    // MUT_PROGRESSS_VALUE: (state, payload) => {
    //     state.ds_params = payload
    // }
  },
  actions: {
    // ACT_PROGRESSS_VALUE: ({commit, payload}) => {
    //     commit('MUT_PROGRESSS_VALUE', payload)
    // }
  },
});

export default store;
