<template>
  <v-container>
    <h1>Offsets</h1>
    <v-row dense class="offsets-header container">
      <v-col sm="3">
        <p>Eje</p>
      </v-col>
      <v-spacer></v-spacer>
      <v-col sm="3">
        <p>Offset Actual (º)</p>
      </v-col>
      <v-spacer></v-spacer>
      <v-col sm="3">
        <p>Offset Deseado (º)</p>
      </v-col>
    </v-row>
    <Offset
      :key="id"
      v-for="(axis,id) in axises"
      class="container"
      :axis="axis.number"
      :currentOffset="axis.currentOffset"
      :desiredOffset="axis.desiredOffset"
      v-on:desiredOffsetChanged="updateOffset"
    />

    <v-row justify="space-around">
      <v-col>
        <v-btn @click="readOffsets">Leer Offsets</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="sendOffsets">Escribir Offsets</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Offset from "@/components/Offset";

export default {
  name: "Offsets",
  components: {
    Offset
  },
  data() {
    return {
      axises: []
    };
  },
  methods: {
    updateOffset(newVal){
      for(let i = 0; i < this.axises.length; i++){
        if(this.axises[i].number == newVal.axis){
          if(isNaN(newVal.desiredOffset)){
                this.axises[i].desiredOffset = 0
                return
          }
          this.axises[i].desiredOffset = Math.round(((parseFloat(newVal.desiredOffset)%360) + Number.EPSILON) * 100) / 100
          console.log(newVal.desiredOffset)
          console.log(this.axises[i].desiredOffset)
        }
      }
    },
    sendOffsets() {
      console.log(this.axises)
      if (typeof pywebview !== "undefined") {
        this.axises.forEach(axis => {
          if (axis.currentOffset !== axis.desiredOffset) {
            /* eslint-disable-next-line */
            pywebview.api.PyWriteOffset(axis);
          }
        });
      }
    },
    readOffsets() {
      if (typeof pywebview !== "undefined") {
        /* eslint-disable-next-line */
        pywebview.api.PyReadOffsets().then(offsets => {
          console.log(offsets);
          this.axises = offsets;
        });
      }
    }
  },
  created() {
    if (typeof pywebview !== "undefined") {
      //alert("Entro en crear");
      this.readOffsets()
      return
    }
    this.axises.push({ number: 0, currentOffset: 1, desiredOffset: 2 });
  },

}
</script>

<style>
.offsets-header p {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
</style>