<template>
  <div class="text-center">
    <v-dialog v-model="dataOfChild.alert_flag" width="500">
      <v-card class="modal_1 limit-width">
        <img class="mt-4" src="@/img/modal_icon1.png" alt="icon" />
        <v-card-text class="mt-4">
          <span
            style="font-weight: bold;color: #2d7ede;letter-spacing: -0.02em;font-size: 15px;"
            >{{ dataOfChild.err_content1 }}</span
          >
        </v-card-text>
        <v-card-text>
          {{ dataOfChild.err_content2 }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="wide" @click="$emit('update')">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["dataOfChild"],
  data() {
    return {
      alert_flag: false,
    };
  },
  watch: {
    alert_flag: function() {
      console.log(this.alert_flag);
    },
  },
  create: async function() {},
  async mounted() {},
};
</script>
<style></style>
