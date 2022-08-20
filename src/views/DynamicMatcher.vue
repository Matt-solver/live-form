<template>
  <div>
    <div v-if="currentComp === 'SelectIdType'">
      <select-id-type></select-id-type>
    </div>
    <div v-if="currentComp === 'SelectIssueCountry'">
      <select-issue-country></select-issue-country>
    </div>
    <div v-if="currentComp === 'TakeIdPhoto'">
      <take-id-photo></take-id-photo>
    </div>
    <div v-if="currentComp === 'TakeFacePhoto'">
      <take-face-photo></take-face-photo>
    </div>
    <div v-if="currentComp === 'ProofOfAddress'">
      <proof-of-address></proof-of-address>
    </div>
    <div v-if="currentComp === 'SubmitKyc'">
      <submit-kyc></submit-kyc>
    </div>
    <div v-if="currentComp === 'KycResult'">
      <kyc-result></kyc-result>
    </div>
    <div v-if="currentComp === 'ErrorPage'">
      <error-page></error-page>
    </div>
  </div>
</template>

<script>
import SelectIdType from "./components/StepToSelectIdType.vue";
import SelectIssueCountry from "./components/StepToSelectIssueCountry.vue";
import TakeIdPhoto from "./components/StepToTakeIdPhoto.vue";
import takeFacePhoto from "./components/StepToTakeFacePhoto.vue";
import ProofOfAddress from "./components/ProofOfAddress.vue";
import SubmitKyc from "./components/StepToSubmit.vue";
import KycResult from "./components/StepToResult.vue";
import ErrorPage from "./components/ErrorPage.vue";

export default {
  components: {
    SelectIdType,
    SelectIssueCountry,
    TakeIdPhoto,
    takeFacePhoto,
    ProofOfAddress,
    SubmitKyc,
    KycResult,
    ErrorPage,
  },
  mounted() {
    console.log("$router", this.$router);
    console.log("$route", this.$route);
    console.log(this.$route.params.name);
  },
  computed: {
    currentComp() {
      return this.$route.params.name;
    },
  },
};
</script>
