<template>
  <div v-resize="onResize">
    <!-- 🆔 ID Select box -->
    <div v-if="flag_select_box" ref="select_box_wrap" class="select_box_wrap">
      <div class="select_box slide-up">
        <div>
          <p>{{ $t("message.step0-6") }}</p>
          <a
            ><img
              ref="close"
              src="../../img/close.png"
              alt="close"
              class="close"
              @click="closeBox"
          /></a>
        </div>
        <a
          v-show="psptFlag || !flag_options"
          class="id pspt"
          @mousedown="hovering('.pspt')"
          @click="next_step('passport')"
          ><p class="left">
            <img src="../../img/icon1.png" alt="Passport" /><span
              style="color: #6aa3e8"
              >{{ $t("message.step0-2") }}</span
            >
          </p></a
        >
        <a
          v-show="dlsFlag || !flag_options"
          class="id dls"
          @mousedown="hovering('.dls')"
          @click="next_step('driver_license')"
          ><p class="left">
            <img src="../../img/icon2.png" alt="Driver License" /><span
              style="color: #6aa3e8"
              >{{ $t("message.step0-3") }}</span
            >
          </p></a
        >
        <a
          v-show="govidFlag || !flag_options"
          class="id govid"
          @mousedown="hovering('.govid')"
          @click="next_step('government_ID')"
          ><p class="left">
            <img src="../../img/icon3.png" alt="Government ID" /><span
              style="color: #6aa3e8"
              >{{ $t("message.step0-4") }}</span
            >
          </p></a
        >
      </div>
    </div>
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

      <div v-if="!flag_qrcode" class="scroll-container">
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
                  outlined
                  dense
                  :menu-props="{ bottom: true, offsetY: true }"
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
                      <v-icon large color="teal darken-2"> mdi-email </v-icon>
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

        <!-- 📃 Service Documents -->
        <div id="terms" style="height: 100%">
          <b-card
            class="card-2"
            :header="$t('message.step0-18')"
            header-tag="header"
          >
            <agreement-doc>
              <template v-slot:terms>
                <terms-of-service></terms-of-service>
              </template>
              <template v-slot:button>
                <b-col cols="6" align="center">
                  <b-button
                    pill
                    class="grey lighten-2 w-100 text--disabled text-truncate"
                    @click="disagree"
                    >{{ $t("message.step0-21") }}</b-button
                  >
                </b-col>
                <b-col cols="6" align="center">
                  <b-button
                    pill
                    variant="primary"
                    class="w-100 text-truncate"
                    ><b-checkbox v-model="agreePersonal"
                      ><span class="white--text">{{
                        $t("message.step0-20")
                      }}</span></b-checkbox
                    ></b-button
                  >
                </b-col>
              </template>
            </agreement-doc>
          </b-card>
        </div>
        <div id="policy" style="height: 100%">
          <b-card
            class="card-3"
            :header="$t('message.step0-19')"
            header-tag="header"
          >
            <agreement-doc>
              <template v-slot:policy>
                <privacy-policy></privacy-policy>
              </template>
              <template v-slot:button>
                <b-col cols="6" align="center">
                  <b-button
                    pill
                    variant="secondary"
                    class="grey lighten-2 w-100 text--disabled text-truncate"
                    @click="disagree"
                    >{{ $t("message.step0-21") }}</b-button
                  >
                </b-col>
                <b-col cols="6" align="center">
                  <b-button
                    pill
                    variant="primary"
                    class="w-100 text-truncate"
                  >
                    <b-checkbox v-model="agreePolicy"
                      ><span class="white--text">{{
                        $t("message.step0-20")
                      }}</span></b-checkbox
                    ></b-button
                  >
                </b-col>
              </template>
            </agreement-doc>
          </b-card>
        </div>
      </div>
    </b-card-group>
  </div>
</template>

<script>
import { Step0_select_ID_type } from "@/mixin/Step0_select_ID_type";
import AlertPopup from "./childComponent/AlertPopup";
import agreementDoc from "./childComponent/agreementDoc";
import termsOfService from "./childComponent/docs/terms";
import privacyPolicy from "./childComponent/docs/policy";

export default {
  name: "Step0",
  mixins: [Step0_select_ID_type],
  components: {
    AlertPopup,
    agreementDoc,
    termsOfService,
    privacyPolicy,
  },
};
</script>
<style>
</style>
