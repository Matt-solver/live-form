<template>
  <div v-resize="onResize">
    <!-- 🆔 ID Select box -->
    <select-box
      :dataOfChild="{
        flag_select_box,
        flag_options,
        psptFlag,
        dlsFlag,
        govidFlag,
        closeBox,
      }"
      @childProp="next_step"
    ></select-box>

    <b-card-group deck ref="group">
      <!-- QR Code -->
      <b-card v-show="flag_qrcode" class="card-0" style="height: 100vh">
        <h1 id="qr_code">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-card-text>{{ envError }}</v-card-text>
            <v-list-item>
              <v-list-item-content>
                <div ref="timer" id="timer" class="overline"></div>
              </v-list-item-content>
              <canvas
                ref="qrcode"
                id="qrcode"
                class="z-index-4"
                style="max-width: 200px; max-height: 200px"
              ></canvas>
            </v-list-item>
          </v-card>
        </h1>
      </b-card>

      <div id="home" v-if="!flag_qrcode" style="height: 100%; width: 100%">
        <b-card style="height: 700px" class="card-1">
          <!--⏳ loader -->
          <h1 v-if="loading" class="sumit_box fadein z-index-4 limit-width">
            <img src="../../img/loader.gif" alt="sumit" />
            <p>{{ $t("message.start") }}</p>
          </h1>

          <!-- ⚠️ -->
          <Alert-popup
            :dataOfChild="popup"
            v-on:update="close_alert"
          ></Alert-popup>

          <div v-show="flag_wrap" ref="wrap" class="wrap">
            <!-- 📙 Language-->
            <div class="absolute" style="right: 0; width: 45%">
              <v-select
                v-model="lang"
                :items="languageValues"
                id="lang"
                class="ma-3"
                item-color="primary"
                outlined
                hide-details
                dense
                validate-on-blur
                :menu-props="{
                  bottom: true, offsetY: true, maxHeight: 100
                }"
                @change="changeLang"
              >
              </v-select>
            </div>

            <!-- Customized Logo -->
            <h1 v-show="logoFlag && !loading">
              <img :src="GET_LOGO" alt="" />
            </h1>

            <!-- 📧 E-mail -->
            <div v-show="flag_email_wrap" class="form-group e-mail_wrap">
              <div v-show="flag_email" key="email" class="input-email">
                <p>{{ $t("message.step0-5") }}</p>
                <div>
                  <div
                    v-if="flag_email_btn_click"
                    key="submitEmail"
                    ref="emailTimer"
                    class="absolute pa-4"
                    style="right: 0"
                  >
                    <span>{{ current_time }}</span>
                  </div>
                  <div
                    v-if="!flag_email_btn_click"
                    key="submitEmail"
                    ref="submitEmail"
                    class="absolute pa-3"
                    style="right: 0"
                    @click="emailAuthentication()"
                  >
                    <v-icon
                      v-show="flag.emailVerification"
                      large
                      color="teal darken-2"
                    >
                      mdi-email
                    </v-icon>
                  </div>
                  <input
                    ref="email"
                    id="email"
                    type="text"
                    placeholder="ex )  argos@argos.com"
                    v-model="email"
                  />
                </div>
              </div>
              <!-- HOME BUTTON
                  In case of Email authentication is not supported in user options 
                  In case of Email received from the url is successful
                  Show this Home button
                -->
              <div>
                <b-button
                  ref="homeBtn"
                  type="button"
                  :class="homeBtnClass"
                  @click="show_id_selector"
                >
                  {{ $t("message.step0-1") }}
                  <!-- <v-icon small style="filter: invert(100%);"> mdi-android </v-icon>
                    <v-icon small style="filter: invert(100%);"> mdi-apple </v-icon>> -->
                </b-button>
              </div>
              <!--// HOME BUTTON -->
            </div>
          </div>
        </b-card>
      </div>
    </b-card-group>
  </div>
</template>

<script>
import { Step0_select_ID_type } from "@/mixin/Step0_select_ID_type";
import AlertPopup from "./childComponent/AlertPopup";
import selectBox from "./childComponent/comp-child-selectbox";

export default {
  name: "Step0",
  mixins: [Step0_select_ID_type],
  components: {
    AlertPopup,
    selectBox,
  },
};
</script>
<style>
div.v-select-list {
  background-color: #00857a;
}
</style>
