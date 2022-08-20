<template>
  <div>
    <slot>
      <div
        v-show="dataOfChild.flag_select_box"
        ref="select_box_wrap"
        class="select_box_wrap"
      >
        <div class="select_box slide-up">
          <div>
            <p>{{ $t("message.step0-6") }}</p>
            <a
              ><img
                ref="close"
                src="../../../img/close.png"
                alt="close"
                class="close"
                @click="dataOfChild.closeBox"
            /></a>
          </div>
          <a
            v-b-hover="handleHover1"
            v-show="dataOfChild.psptFlag|| !dataOfChild.flag_options"
            class="id pspt"
            @click="$emit('childProp', 'passport')"
            ><p :class="isHovered1 ? 'on' : ''" >
              <img v-if="isHovered1" src="../../../img/icon1_on.png" alt="Passport" />
              <img v-else src="../../../img/icon1.png" alt="Passport" />
              
              <span
                :class="isHovered1 ? 'text-white' : ''"
                style="color: #6aa3e8"
                >{{ $t("message.step0-2") }}</span
              >              
            </p>
            
            </a
          >
          <a
            v-b-hover="handleHover2"
            v-show="dataOfChild.dlsFlag || !dataOfChild.flag_options"
            class="id dls"
            @click="$emit('childProp', 'driver_license')"
            ><p :class="isHovered2 ? 'on' : ''">
              <img v-if="isHovered2" src="../../../img/icon2_on.png" alt="driver_license" />
              <img v-else src="../../../img/icon2.png" alt="driver_license" />
              <span
                :class="isHovered2 ? 'text-white' : ''"
                style="color: #6aa3e8"
                >{{ $t("message.step0-3") }}</span
              >
            </p></a
          >
          <a
            v-b-hover="handleHover3"
            v-show="dataOfChild.govidFlag || !dataOfChild.flag_options"
            class="id govid"
            @click="$emit('childProp', 'government_ID')"
            ><p :class="isHovered3 ? 'on' : ''">
              <img v-if="isHovered3" src="../../../img/icon3_on.png" alt="government_ID" />
              <img v-else src="../../../img/icon3.png" alt="government_ID" />
              <span
                :class="isHovered3 ? 'text-white' : ''"
                style="color: #6aa3e8"
                >{{ $t("message.step0-4") }}</span
              >
            </p></a
          >
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  props: ["dataOfChild"],
  data() {
    return {
      isHovered1: false,
      isHovered2: false,
      isHovered3: false,
    };
  },
  async mounted() {
    console.log(this.dataOfChild);
  },
  methods: {
    handleHover1(hovered) {
      this.isHovered1 = hovered;
    },
    handleHover2(hovered) {
      this.isHovered2 = hovered;
    },
    handleHover3(hovered) {
      this.isHovered3 = hovered;
    },
    // hovering: function(key) {
    //   document.querySelectorAll(".pspt, .dls, .govid")
    //   .forEach((el) => (el.firstChild.style.backgroundColor = "#ffffff"));

    //   document.querySelector(key).firstChild.style.backgroundColor = "#e8efff";
    // },
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>
