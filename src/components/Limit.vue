<template>
	<v-row dense justify="space-around" align="center">
		<v-col sm="3">
			<v-text-field
				class="input-centered"
				type="number"
				v-model="axis.number"
				single-line
				disabled
				outlined
			></v-text-field>
		</v-col>
		<v-col sm="3">
			<v-text-field
				class="input-centered"
				type="number"
				v-model="axis.forwardLimit"
				v-on:blur="updateLimit"
				single-line
				outlined
				:background-color="forwardLimitColor"
			></v-text-field>
		</v-col>
		<v-col sm="3">
			<v-text-field
				type="number"
				class="input-centered"
				v-model="axis.reverseLimit"
				v-on:blur="updateLimit"
				single-line
				outlined
				:background-color="reverseLimitColor"
			></v-text-field>
		</v-col>
	</v-row>
</template>

<script>
export default {
	name: "Limite",
	data() {
		return {
			forwardLimitColor: "white",
			reverseLimitColor: "white"
		};
	},
	props: ["axis"],
	watch: {
		"axis.forwardLimit": function(newVal) {
            console.log("Cambio Color");
			if (newVal != this.axis.lastForwardLimit) {
				this.forwardLimitColor = "red";
				return;
			}
			this.forwardLimitColor = "white";
		},
		"axis.reverseLimit": function(newVal) {
            console.log("Cambio Color 2");
            if (newVal != this.axis.lastReverseLimit) {
				this.reverseLimitColor = "red";
				return;
			}
			this.reverseLimitColor = "white";
		}
	},
	methods: {
		updateLimit() {
                let error = false
				if (isNaN(this.axis.forwardLimit)) {
					this.axis.forwardLimit = 0;
					error = true;
                }
                if(isNaN(this.axis.reverseLimit)){
                    this.axis.reverseLimit = 0;
                    error = true;
                }
                if(!error){
                    this.axis.forwardLimit =
					Math.round(
						((parseFloat(this.axis.forwardLimit) % 360) +
							Number.EPSILON) *
							100
					) / 100;
                }
			}
    }
};
</script>

<style scoped>
red--text {
	background-color: red;
}
green--text {
	background-color: green;
}
</style>