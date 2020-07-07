<template>
<v-row dense class="offset" justify="space-around">
    <v-col sm="2">
    <v-text-field class="input-centered" v-model="axis" single-line disabled outlined>
    </v-text-field>
    </v-col>
    <v-col sm="2">
    <v-text-field class="input-centered" v-model="currentOffset" single-line disabled outlined></v-text-field>
    </v-col>
    <v-col sm="2">
    <v-text-field class="input-centered" v-on:blur="changeOffset" v-model="desiredOffset" single-line outlined></v-text-field>
    </v-col>
    <v-col sm="2">
    <v-text-field class="input-centered" v-on:blur="changeOffset" v-model="desiredOffset" single-line outlined></v-text-field>
    </v-col>
    <v-col sm="2">
    <v-text-field class="input-centered" v-on:blur="changeOffset" v-model="desiredOffset" single-line outlined></v-text-field>
    </v-col>
</v-row>
</template>

<script>
export default {
    name: "Offset",
    props: {
        axis: Number,
        currentOffset: Number,
        desiredOffset: Number,
        currentPosition: Number,
        desiredPosition: Number,
    },
    methods: {
        changeOffset(){
            this.$emit('desiredOffsetChanged',{axis: this.axis,currentOffset: this.currentOffset,desiredOffset: this.desiredOffset})
        }
    },
    watch: {
        
    }
}
</script>

<style>
.input-centered input {
  text-align: center;
  font-size: 15px;
}
</style>