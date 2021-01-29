<template>
  <div class="screen fadein" v-resize="onResize">
    <Header
      :dataOfChild="$store.state.titleType"
      v-on:update="backBtn"
    ></Header>
    <v-row align="center" justify="center">
      <v-col style="padding:0">
        <v-row align="center" justify="center">
          <div class="select_country limit-width wide my-5">
            <p class="pl-2">{{ $t("message.step1-3") }}</p>
            <v-text-field
              v-model="search"
              class="px-9"
              style="border-radius:6px;"
              :placeholder="this.placeholder"
              append-icon="mdi-magnify"
              filled
              rounded
              hide-details
              @click="convert_label_search()"
            ></v-text-field>
          </div>
        </v-row>
      </v-col>
    </v-row>

    <Alert-popup :dataOfChild="popup" v-on:update="close_alert"></Alert-popup>

    <v-row align="center">
      <v-col cols="12">
        <!-- Select National code -->
        <template>
          <v-card
            max-width="600"
            class="card mx-auto z-index-1"
            style="height:80vh;overflow-y:auto"
          >
            <v-list three-line>
              <div
                class="country_list_box"
                v-for="item in filteredList"
                :key="item.value + '-' + item.name"
                @click="onListEvent(item)"
              >
                <p class="country_list">
                  <img
                    :src="require(`@/assets/country/${item.name}.png`)"
                    alt="korea"
                  />{{item.label}}, {{item.value}}
                </p>

                <!-- <v-subheader
                  v-if="item.header"
                  :key="index"
                  v-text="item.header"
                ></v-subheader>

                <v-divider
                  v-else-if="item.divider"
                  :key="index"
                  :inset="item.inset"
                ></v-divider>

                <v-list-item
                  class="list0"
                  v-else-if="index === 0"
                  :key="index"
                  style="margin-top:10px"
                  @click="
                    next_step(item.label, item.name, item.value, item.status)
                  "
                >
                  <v-list-item-content>
                    <v-col cols="2" style="padding:0;margin:0;">
                      <v-list-item-avatar align="center" justify="center">
                        <img
                          :src="require(`@/assets/country/${item.name}.png`)"
                          style=""
                        />
                      </v-list-item-avatar>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-title
                        v-if="$store.state.isDark !== 'dark'"
                        class="ttl"
                        style="font-size:.75em;"
                        v-html="item.label + ', ' + item.value"
                      ></v-list-item-title>
                      <v-list-item-title
                        v-if="$store.state.isDark === 'dark'"
                        class="white--text"
                        style="font-size:.75em;"
                        v-html="item.label + ', ' + item.value"
                      ></v-list-item-title>
                    </v-col>
                    <v-col cols="2" class="text-right">
                      <v-icon v-if="regionCode" class="white--text">mdi-chevron-right</v-icon>
                      <v-icon v-if="!regionCode">mdi-chevron-right</v-icon>
                    </v-col>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-else
                  :key="index"
                  style="margin-top:10px"
                  @click="
                    next_step(item.label, item.name, item.value, item.status)
                  "
                >
                  <v-list-item-content>
                    <v-col cols="2" style="padding:0;margin:0;">
                      <v-list-item-avatar align="center" justify="center">
                        <img
                          :src="require(`@/assets/country/${item.name}.png`)"
                          style=""
                        />
                      </v-list-item-avatar>
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-title
                        v-if="$store.state.isDark !== 'dark'"
                        class="ttl"
                        style="font-size:.75em;"
                        v-html="item.label + ', ' + item.value"
                      ></v-list-item-title>
                      <v-list-item-title
                        v-if="$store.state.isDark === 'dark'"
                        class="ttl white--text"
                        style="font-size:.75em;"
                        v-html="item.label + ', ' + item.value"
                      ></v-list-item-title>
                    </v-col>
                    <v-col cols="2" class="text-right">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-col>
                  </v-list-item-content>
                </v-list-item> -->
              </div>
              <div class="wide title" style="text-align:center">
                {{ searchText }}
              </div>
            </v-list>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Step1_select_issue_country } from "@/mixin/Step1_select_issue_country";
import Header from "./childComponent/Header";
import AlertPopup from "./childComponent/AlertPopup";

export default {
  name: "Step1-2",
  mixins: [Step1_select_issue_country],
  components: {
    Header,
    AlertPopup,
  },
  data(){
    return{
      flag:{
        countryList: ''
      }
    }
  },
  mounted(){

    this.onListEvent()

  },
  methods:{
  }
};
</script>
<style>
/* .card {
  background: rgba(0, 0, 0, 0.06) !important;
} */
.v-list {
  padding: 0 !important;
  /* width: 100% !important; */
  background: rgba(0, 0, 0, 0.06) !important;
}
/* .v-list-item {
  background: #fff !important;
} */
/* .v-list-item__content {
  padding: 0 !important;
} */
/* .v-list-item-content {
  padding: 0 !important;
} */
/* .v-list-item__avatar {
  margin-bottom: 0 !important;
  margin-top: 0 !important;
} */
/* .v-list--three-line .v-list-item,
.v-list-item--three-line {
  min-height: 0 !important;
} */
/* .v-sheet, */
/* .v-card {
  box-shadow: 0 0 0 0 rgb(255, 255, 255), 0 0 0 0 rgb(255, 255, 255),
    0 0 0 0 rgb(255, 255, 255) !important;
} */
/* .v-icon {
  color: rgba(0, 0, 0, 0.2) !important;
} */
</style>
