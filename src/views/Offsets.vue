<template>
	<v-container>
        <WaitDialog :dialog="lockButtons" :msg="displayMgs"/>
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
		<v-row dense class="offset" justify="space-around" :key="id" v-for="(axis,id) in axes">
			<v-col sm="2">
				<v-text-field class="input-centered" v-model="axis.number" single-line disabled outlined></v-text-field>
			</v-col>
			<v-col sm="2">
				<v-text-field class="input-centered" v-model="axis.currentOffset" single-line disabled outlined></v-text-field>
			</v-col>
			<v-col sm="2">
				<v-text-field
					class="input-centered"
					v-on:blur="updateOffset"
					v-model="axis.desiredOffset"
					single-line
					outlined
				></v-text-field>
			</v-col>
			<v-col sm="2">
				<v-text-field class="input-centered" disabled v-model="axis.currentPosition" single-line outlined></v-text-field>
			</v-col>
			<v-col sm="2">
				<v-text-field v-on:blur="calcOffsets" class="input-centered" v-model="axis.desiredPosition" single-line outlined></v-text-field>
			</v-col>
		</v-row>

		<v-row dense justify="space-around">
			<v-col>
				<v-btn @click="readOffsetsPositions" :disabled="lockButtons">Leer Offsets y Posiciones</v-btn>
			</v-col>
			<v-col>
				<v-btn @click="calcOffsets" :disabled="lockButtons">Calcular Offsets</v-btn>
			</v-col>
			<v-col>
				<v-btn @click="sendOffsets" :disabled="lockButtons">Escribir Offsets</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>


export default {
	name: "Offsets",
	components: {
	},
	data() {
		return {
			axes: [],
			filename: "",
            lockButtons: false,
            displayMsg: ""
		};
	},
	methods: {
		updateOffset(newVal) {
			console.log("Entro tmb");
			console.log(this.axes);
			for (let i = 0; i < this.axes.length; i++) {
				if (this.axes[i].number == newVal.axis) {
					if (isNaN(newVal.desiredOffset)) {
						this.axes[i].desiredOffset = 0;
						return;
					}
					this.axes[i].desiredOffset =
						Math.round(
							((parseFloat(newVal.desiredOffset) % 360) +
								Number.EPSILON) *
								100
						) / 100;
				}
			}
			console.log(this.axes);
		},
		sendOffsets() {
            this.displayMsg = "Escribiendo Offsets"
			this.lockButtons = true;
			if (typeof pywebview !== "undefined") {
				this.axes.forEach(async axis => {
					if (axis.currentOffset !== axis.desiredOffset) {
						/* eslint-disable-next-line */
						let resp = await pywebview.api.PyWriteOffset(axis.number,axis.desiredOffset);
						if (!resp) {
							alert(
								`Error escribiendo El offset de ${axis.number}`
							);
							return;
						}
						axis.currentOffset = parseFloat(resp).toFixed(2);
					}
				});
			}
			this.lockButtons = false;
		},
		async readOffsetsPositions() {
            this.displayMsg = "Leyendo Offsets y posiciones"
			this.lockButtons = true;
			if (typeof pywebview !== "undefined") {
				/* eslint-disable-next-line */
				let resp = await pywebview.api.PyReadPositionsAndOffsets();
				if (!resp) {
					alert("Error leyendo los offsets y las posiciones");
				}
				this.axes = resp;
			}
			this.lockButtons = false;
		},
		calcOffsets() {
            this.displayMsg = "Calculando Offsets"
			this.lockButtons = true;
			let wrapTo360 = angle => {
				if (angle >= 0) {
					return angle % 360;
				}
				return 360 + (angle % 360);
			};
			console.log(this.axes);
			this.axes.forEach(axis => {
				axis.desiredOffset = wrapTo360(
					parseFloat(axis.currentOffset) -
						(parseFloat(axis.desiredPosition) -
							parseFloat(axis.currentPosition)).toFixed(2)
				);
            });
			this.lockButtons = false;
		}
	},

	created() {
		if (typeof pywebview !== "undefined") {
			//alert("Entro en crear");
			this.readOffsetsPositions();
			return;
		}
		this.axes.push({
			number: 0,
			currentOffset: 1,
			desiredOffset: 2,
			currentPosition: 3,
			desiredPosition: 180
		});
	}
};
</script>

<style>
.offsets-header p {
	font-size: 20px;
	font-weight: bold;
	text-align: center;
}
.input-centered input {
  text-align: center;
  font-size: 15px;
}
</style>