<template>
  <v-app>
    <TopMenu />
    <v-main class="my-4 mx-4">
    <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopMenu from "./components/TopMenu"
export default {
  name: "App",

  components: {
    TopMenu
  },

  data: () => ({
    //
  })
};
</script>
