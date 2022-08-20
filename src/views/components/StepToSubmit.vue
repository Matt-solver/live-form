<template>
  <div
    class="screen fadein"
    style="width: 100%; height: 100%"
    v-resize="onResize"
  >
    <Header
      :dataOfChild="$store.state.titleType"
      v-on:update="backBtn"
    ></Header>

    <!-- Alert -->
    <div class="text-center z-index-4">
      <v-dialog v-model="alert_flag2" width="500">
        <v-card class="modal_1">
          <img class="mt-4" src="../../img/modal_icon1.png" alt="icon" />
          <v-card-text class="mt-4">
            Cannot submit if under age {{ this.$store.state.LMT_AGE }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              class="wide"
              @click="
                alert_flag2 = false;
                backBtn();
              "
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <Alert-popup :dataOfChild="popup" v-on:update="close_alert"></Alert-popup>

    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <div class="sumit_box fadein wide" style="margin-bottom: 50%">
          <v-progress-circular
            class="my-10"
            :rotate="-90"
            :size="120"
            :width="15"
            :value="this.$store.state.progressValue"
            color="primary"
          >
            {{ this.$store.state.progressValue }}
          </v-progress-circular>

          <p class="my-1">{{ $t("message.step4-1") }}</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { StepToSubmit } from "@/mixin/StepToSubmit.js";
import Header from "./childComponent/Header.vue";
import AlertPopup from "./childComponent/AlertPopup.vue";

// @ is an alias to /src
export default {
  mixins: [StepToSubmit],
  components: {
    Header,
    AlertPopup,
  },
};
</script>
<style>
svg {
  transform: translate(-50%, -50%);
}
</style>
