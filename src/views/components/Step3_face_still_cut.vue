<template>
  <div ref="screen" class="screen fadein" v-resize="onResize">
    <Header :dataOfChild="title" v-on:update="backBtn"></Header>

    <Alert-popup :dataOfChild="popup" v-on:update="close_alert"></Alert-popup>

    <div v-show="uiflag.success" class="successed_wrap z-index-4">
      <div class="successed">
        <img class="mb-0" src="../../img/success.png" alt="icon" />
        <p class="my-0">{{ $t("message.step3-5") }}</p>
      </div>
    </div>

    <h1 v-show="loading" class="sumit_box fadein z-index-4">
      <img
        src="../../img/loader.gif"
        style="transform: translateY(50%)"
        alt="sumit"
      />
    </h1>
    <div
      v-show="uiflag.photo_area"
      ref="photo_area"
      class="photo_area face fadein"
    >
      <img
        v-show="uiflag.sample"
        ref="sample"
        class="sample"
        src="@/assets/static/img/Selfie_Guide.png"
        alt="passport"
      />
      <img
        v-show="uiflag.focus"
        ref="focus"
        class="focus absolute z-index-3"
        src="../../img/ARGOS_FOCUS.png"
      />
      <video
        v-show="uiflag.video"
        id="video"
        ref="video"
        src=""
        autoplay
        playsinline
      />
      <canvas id="c1" ref="faceCanvas" class="z-index-1 off"></canvas>
      <!--//* Matched face cut-->
      <img
        v-show="uiflag.thumbnail"
        ref="faceCut"
        class="faceCut fadein"
        :src="image"
      />
    </div>

    <div v-show="uiflag.photo_box" ref="photo_box" class="photo_box fadein">
      <div v-if="!uiflag.localCam">
        <p class="mb-5">
          <span>{{ $t("message.step3-6") }}</span
          >{{ $t("message.step3-7") }}
        </p>
      </div>

      <v-row
        v-show="$store.state.is_iOS && uiflag.localCamBtn"
        justify="center"
      >
        <label class="file-up mt-5" for="localCam"
          >{{ $t("message.common-1") }}
        </label>
        <input
          id="localCam"
          type="file"
          ref="localCam"
          class="localCam"
          capture="camera"
          accept="image/*"
          hidden
        />
      </v-row>

      <a
        v-show="uiflag.shot_btn"
        ref="shot_btn"
        class="capture-btn"
        @click="next_step"
        ><img
          ref="shotBtn"
          class="shotBtn fadein opacity"
          src="../../img/camera.png"
          alt="camera"
      /></a>
      <div class="button_box" style="">
        <div v-if="uiflag.next_btn" ref="next_btn" class="text_box z-index-5">
          <a @click="next_step()" class="on">{{ $t("message.step2-5") }}</a>
        </div>
        <div v-show="uiflag.retry_btn" ref="retry_btn2" class="text_box2 z-index-5">
          <a @click="retry()">{{ $t("message.step2-6") }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Step3_face_still_cut } from "@/mixin/Step3_face_still_cut";
import Header from "./childComponent/Header";
import AlertPopup from "./childComponent/AlertPopup";

export default {
  mixins: [Step3_face_still_cut],
  components: {
    Header,
    AlertPopup,
  },
};
</script>
<style></style>
