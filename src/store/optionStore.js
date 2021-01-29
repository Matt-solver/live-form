const optionStore = {
    namespaced: true,
    state: {
        LOGO: "https://argos-logo.s3.ap-northeast-2.amazonaws.com/logo_18j0mumkhpj89tx.png",
        TYPE: {},
        blacklistCountries: [],
        ageLimit: 0,
        connectionLink: "",
        kycLevel: "",
        termsOfUse: "",
        privacyPolicy: "",
        emailVerification: false,
    },
    getters: {
        GET_OPTIONS: (state) => state,
        GET_LOGO: (state) => state.LOGO,
        GET_TYPE: (state) => state.TYPE,
        GET_BLACKLIST_COUNTRIES: (state) => state.blacklistCountries,
        GET_AGE_LIMIT: (state) => state.ageLimit,
        GET_CONNECTION_LINK: (state) => state.connectionLink,
        GET_KYC_LEVEL: (state) => state.kycLevel,
        GET_TERMS_OF_USE: (state) => state.termsOfUse,
        GET_PRIVACY_POLICY: (state) => state.privacyPolicy,
        GET_EMAIL_VERIFICATION: (state) => state.emailVerification,
    },
    mutations: {
        MUT_OPTIONS: (state, payload) => {
            // console.log("MUT_OPTIONS", payload);
            state.LOGO = payload.rs_LOGO;
            state.TYPE = payload.rs_TYPE;
            state.blacklistCountries = payload.rs_blacklistCountries;
            state.ageLimit = payload.rs_ageLimit;
            state.connectionLink = payload.rs_connectionLink;
            state.kycLevel = payload.rs_kycLevel;
            state.termsOfUse = payload.rs_termsOfUse;
            state.privacyPolicy = payload.rs_privacyPolicy;
            state.emailVerification = payload.rs_emailVerification;
        },
    },
    actions: {
        ACT_OPTIONS: ({ commit }, payload) => {
            // console.log("ACT_OPTIONS", payload);
            commit("MUT_OPTIONS", payload);
        },
    },
};
export default optionStore;