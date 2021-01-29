<template>
  <v-app>
    <v-main>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width"
        />
        <title>ARGOS</title>
      </head>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: function() {
    return {
      level: "",
    };
  },
};
</script>
<style>
.v-main {
  background: rgba(0, 0, 0, 0.06) !important;
}
.v-main__wrap {
  background: rgba(255, 255, 255) !important;
}
</style>
