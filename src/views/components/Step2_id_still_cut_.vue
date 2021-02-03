<template>
  <div ref="screen" class="screen fadein" v-resize="onResize">
    <!-- 20201208 loader -->
    <!--// loader -->

    <Header
      :dataOfChild="$store.state.titleType"
      v-on:update="backBtn"
    ></Header>

    <Alert-popup :dataOfChild="popup" v-on:update="close_alert"></Alert-popup>

    <div
      v-show="uiflag.success"
      ref="successed_wrap"
      class="successed_wrap z-index-4"
    >
      <div class="successed">
        <img class="mb-0" src="../../img/success.png" alt="icon" />
        <p class="my-0">{{ $t("message.step2-3") }}</p>
      </div>
    </div>

    <h1 v-show="loading" class="sumit_box fadein z-index-4">
      <img src="../../img/loader.gif" alt="sumit" />
    </h1>
    <div
      v-show="uiflag.photo_area"
      ref="photo_area"
      class="photo_area fadein"
      style="text-align: center"
    >
      <!-- Glare detecter -->
      <div
        v-show="flash"
        cols="6"
        class="flash secondary fadein white--text absolute z-index-4"
      >
        {{ $t("message.step2-4") }}
      </div>
      <img
        v-show="uiflag.sample"
        ref="sample"
        class="sample"
        :src="license_img"
      />
      <!-- <img v-if="loading" class="loader absolute fadein" src="../../img/ARGOS_LOADER_3.gif" style="z-index:302;background:#000000ad;"/> -->
      <img
        v-show="uiflag.passport"
        ref="passport"
        class="passport absolute translucent fadein"
        src="../../img/ARGOS_PSPT.png"
        alt="passport"
      />
      <!-- Boundary box -->
      <!--// Face matching target -->
      <!-- <canvas
        id="c2"
        ref="canvas_box"
        class="absolute z-index-2"
        style="border:0;"
      ></canvas> -->

      <!-- Edge Layer -->
      <div v-show="uiflag.edgeLayer" ref="edgeLayer" class="edge-layer">
        <div class="edge-wrap inline-block left">
          <div id="edge1" class="edge"></div>
        </div>
        <div class="edge-wrap deg270 absolute left bottom">
          <div id="edge3" class="edge"></div>
        </div>
        <div class="edge-wrap deg90 right">
          <div id="edge2" class="edge"></div>
        </div>
        <div class="edge-wrap deg180 absolute right bottom">
          <div id="edge4" class="edge"></div>
        </div>
      </div>

      <video
        v-show="uiflag.video"
        id="video"
        ref="video"
        class="fadein"
        src=""
        autoplay
        playsinline
      />
      <canvas
        id="c1"
        ref="canvas"
        class="fadein z-index-1 off"
      ></canvas>
      <!-- Face matching target -->
      <img
        v-show="uiflag.thumbnail"
        ref="queryImage"
        class="queryImage fadein"
        :src="image"
      />

      <p v-if="Issue_country_name && Issue_country_code">
        {{ Issue_country_name.replace("_", " ") }}, {{ Issue_country_code }}
      </p>
    </div>
    <div
      v-show="uiflag.photo_box"
      ref="photo_box"
      class="photo_box fadein z-index-5"
    >
      <div v-if="!uiflag.localCam">
        <p class="mb-5">
          {{ this.$t("message.step2-9") }}
        </p>
        <p class="mb-5">
          <span>{{ sideOfId.toUpperCase() }}</span
          >{{ this.$t("message.step2-10") }} {{ this.$t("message.step2-11") }}
        </p>
      </div>
      <div v-else>
        <p class="mb-0">
          {{ this.$t("message.step2-12") }}
        </p>
        <p class="mb-0">
          <span>{{ sideOfId.toUpperCase() }}</span
          >{{ this.$t("message.step2-10") }} {{ this.$t("message.step2-13") }}
        </p>
        <p class="mb-5">{{ this.$t("message.step2-14") }}</p>
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
        @click="capture()"
        ><img
          ref="shotBtn"
          class="shotBtn fadein opacity"
          src="../../img/camera.png"
          alt="camera"
      /></a>
    </div>
    <div v-show="uiflag.next_btn" ref="retry_btn" class="text_box z-index-5">
      <a @click="next_step()" class="on">{{ $t("message.step2-5") }}</a>
    </div>
    <div v-show="uiflag.retry_btn" ref="retry_btn2" class="text_box2 z-index-5">
      <a @click="retry()">{{ $t("message.step2-6") }}</a>
    </div>
  </div>
</template>

<script>
import { Step2_id_still_cut_ } from "@/mixin/Step2_id_still_cut_";
import AlertPopup from "./childComponent/AlertPopup";
import Header from "./childComponent/Header";

export default {
  mixins: [Step2_id_still_cut_],
  components: {
    Header,
    AlertPopup,
  },
};
</script>
<style>
.edge-layer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.edge-wrap {
  display: block;
  width: 50px;
  height: 50px;
}
.edge {
  position: relative;
  background: #58c69b;
  height: 50px;
  width: 10px;
}
.edge:after {
  background: #58c69b;
  content: "";
  height: 10px;
  left: 0px;
  position: absolute;
  top: 0px;
  width: 50px;
}
.deg90 {
  transform: rotate(90deg);
  left: 100px;
}
.deg180 {
  transform: rotate(180deg);
}
.deg270 {
  transform: rotate(270deg);
}
.right {
  float: right;
  right: 0;
}
.left {
  float: left;
  left: 0;
}
.bottom {
  bottom: 0;
}
.absolute {
  position: absolute;
}
.inline-block {
  display: inline-block;
}
</style>
