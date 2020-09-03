<template>
  <v-app-bar app color="#6A76AB" dark>
    <v-toolbar-title>Posicionador Virtual</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn @click="connect" icon >
      <v-icon>mdi-lan-connect</v-icon>
    </v-btn>

    <template v-slot:extension>
      <v-tabs align-with-title>
        <v-tab :to="{name:'Offsets'}">Offsets</v-tab>
        <v-tab :to="{name:'Movement'}">Mover</v-tab>
        <v-tab :to="{name:'Limits'}">Limites</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
export default {
    methods: {
        connect(){
            alert("Trying to Connect")
            /* eslint-disable-next-line */
            pywebview.api.PyConnect()
            alert("Connected")
        }
    }
};
</script>

<style>
</style>