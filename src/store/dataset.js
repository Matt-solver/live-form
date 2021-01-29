const dataset = {
  namespaced: true,
  state: {
    ds_params: [],
    rs_params: [],
  },
  getters: {
    GET_DS_PARAMS: (state) => state.ds_params,
    GET_RS_PARAMS: (state) => state.rs_params,
  },
  mutations: {
    MUT_DS_PARAMS: (state, payload) => {
      state.ds_params = payload;
    },
    MUT_RS_PARAMS: (state, payload) => {
      state.ds_params = payload;
    },
    MUT_FACE_IMAGE: (state, payload) => {
      state.ds_params.getFaceImage = payload;
    },
    MUT_ADDR_PARAMS: (state, payload) => {
      state.ds_params.getAddress = payload;
    },
    MUT_ADDR_IMAGE: (state, payload) => {
      state.ds_params.getAddressImage = payload;
    },
  },
  actions: {
    ACT_DS_PARAMS: ({ commit }, payload) => {
      commit("MUT_DS_PARAMS", payload);
    },
    ACT_RS_PARAMS: ({ commit }, payload) => {
      commit("MUT_RS_PARAMS", payload);
    },
    ACT_FACE_IMAGE: ({ commit }, payload) => {
      commit("MUT_FACE_IMAGE", payload);
    },
    ACT_ADDR_PARAMS: ({ commit }, payload) => {
      commit("MUT_ADDR_PARAMS", payload);
    },
    ACT_ADDR_IMAGE: ({ commit }, payload) => {
      commit("MUT_ADDR_IMAGE", payload);
    },
  },
};
export default dataset;
