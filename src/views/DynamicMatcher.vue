<template>
  <div> 
    <div v-if="currentComp === 'SelectIdType'">
      <select-id-type></select-id-type>
    </div>
    <div v-if="currentComp === 'SelectIssueCountry'">
      <select-issue-country></select-issue-country>
    </div>
    <div v-if="currentComp === 'IdStillCut'">
      <id-still-cut></id-still-cut>
    </div>
    <div v-if="currentComp === 'FaceStillcut'">
      <face-stillcut></face-stillcut>
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
    <div v-if="currentComp === 'test'">
      <test></test>
    </div>
  </div>
</template>

<script>
  import SelectIdType from "./components/Step0_select_ID_type";
  import SelectIssueCountry from "./components/Step1_select_issue_country";
  import IdStillCut from "./components/Step2_id_still_cut_";
  import FaceStillcut from "./components/Step3_face_still_cut";
  import ProofOfAddress from "./components/Proof_of_address";
  import SubmitKyc from "./components/Step4_submit";
  import KycResult from "./components/Step5_result";
  import ErrorPage from "./components/ErrorPage";
  import test from "./components/test";

  export default {
    components: {
      SelectIdType,
      SelectIssueCountry,
      IdStillCut,
      FaceStillcut,
      ProofOfAddress,
      SubmitKyc,
      KycResult,
      ErrorPage,
      test, 
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
