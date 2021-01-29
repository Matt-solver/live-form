<template>
  <div v-if="this.$store.state.type" ref="bar_wrap" class="bar_wrap z-index-5">
    <button
      @click="$emit('update')"
      class="absolute"
      style="width:20%;height:12%;"
    ></button>
    <div class="bar">
      <p>{{ dataOfChild }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["dataOfChild"],
  data() {
    return {};
  },
};
</script>
