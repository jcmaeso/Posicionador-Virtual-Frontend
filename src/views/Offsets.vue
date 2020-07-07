<template>
  <v-container>
    <h1>Offsets</h1>
    <v-row dense class="offsets-header container" justify="space-around">
      <v-col sm="2">
        <p>Eje</p>
      </v-col>
      <v-col sm="2">
        <p>Offset Actual (º)</p>
      </v-col>
      <v-col sm="2">
        <p>Offset Deseado (º)</p>
      </v-col>
      <v-col sm="2">
        <p>Posición Actual(º)</p>
      </v-col>
      <v-col sm="2">
        <p>Posición Deseada(º)</p>
      </v-col>
    </v-row>
    <Offset
      :key="id"
      v-for="(axis,id) in axises"
      class="container"
      :axis="axis.number"
      :currentOffset="axis.currentOffset"
      :desiredOffset="axis.desiredOffset"
      :currentPosition="axis.currentPosition"
      :desiredPosition="axis.desiredPosition"
      v-on:desiredOffsetChanged="updateOffset"
    />

    <v-row dense justify="space-around">
      <v-col sm="2">
        <v-btn @click="readOffsetsPositions">Leer Offsets y Posiciones</v-btn>
      </v-col>
      <v-col sm="2">
        <v-btn @click="sendOffsets">Escribir Offsets</v-btn>
      </v-col>
      <v-col sm="2">
        <v-btn @click="calcOffsets">Calcular Offsets</v-btn>
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
        this.axises.forEach(async axis => {
          if (axis.currentOffset !== axis.desiredOffset) {
            /* eslint-disable-next-line */
            await pywebview.api.PyWriteOffset(axis);
          }
        });
      }
    },
    readOffsetsPositions() {
      if (typeof pywebview !== "undefined") {
        /* eslint-disable-next-line */
        pywebview.api.PyReadOffsets().then(offsets => {
          console.log(offsets);
          this.axises = offsets;
        });
      }
    },
    calcOffsets(){
      if (typeof pywebview !== "undefined") {
        this.axises.forEach(async axis => {
          if (axis.currentPosition !== axis.desiredPosition) {
            /* eslint-disable-next-line */
            axis = await pywebview.api.PyCalcOffset(axis);
          }
        });
      }
    }
  },


  created() {
    if (typeof pywebview !== "undefined") {
      //alert("Entro en crear");
      this.readOffsetsPositions()
      return
    }
    this.axises.push({ number: 0, currentOffset: 1, desiredOffset: 2, currentPosition: 180, desiredPosition: 180});
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