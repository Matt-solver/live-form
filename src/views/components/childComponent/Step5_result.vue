<template>
  <div class="screen fadein" v-resize="onResize">
    <!-- <div class="bar_wrap" v-if="this.$store.state.type">
      <button @click="backBtn()" class="absolute" style="width:20%;height:12%;"></button>
      <div class="bar">
        <p style="background:url()">KYC Result</p>
      </div>
    </div>   -->
    <h1 class="fadein" style="top: 10%">
      <img
        v-if="error"
        class="fadein"
        style="width: 50%"
        src="../../img/error.png"
        alt="sumit"
      />
      <div class="sumit_box">
        <img v-if="!error" src="../../img/sumit.png" alt="sumit" />
        <p class="my-0">
          {{ resultText1 }}<br />
          {{ resultText2 }}<br />
        </p>
        <span v-if="!error">{{ $t("message.step5-1") }}</span>
      </div>
      <v-btn
        v-if="!error && linkFlag"
        class="primary"
        style="width: 85%"
        large
        @click="go_Linked_page"
      >
        <span class="white--text">{{ btnText }}</span>
      </v-btn>
      <v-btn
        v-if="error"
        class="primary"
        style="width: 85%"
        large
        @click="goHome"
      >
        <span class="white--text">{{ btnText }}</span>
      </v-btn>
    </h1>
  </div>
</template>
<script>
import { StepToResult } from "@/mixin/StepToResult";

// @ is an alias to /src
export default {
  mixins: [StepToResult],
};
</script>
<style>
h1 {
  transform: translate(-50%, -50%);
}
</style>
