<template>
	<v-container fluid fill-content>
		<WaitDialog :dialog="lockButtons" :msg="displayMsg" />
		<v-row dense align="center" justify="space-around" class="offsets-header container">
			<v-col sm="3">
				<p>Eje</p>
			</v-col>
			<v-col sm="3">
				<p>Limite Directa</p>
			</v-col>
			<v-col sm="3">
				<p>Limite Inversa</p>
			</v-col>
		</v-row>
		<div :key="id" v-for="(axis,id) in axes">
			<Limit :axis="axis"></Limit>
		</div>
		<v-row justify-space-around align-center>
			<v-col sm="5">
				<v-btn @click="readLimits" :disabled="lockButtons">Leer Limites</v-btn>
			</v-col>
			<v-col sm="5">
				<v-btn @click="writeLimits" :disabled="lockButtons">Escribir Limites</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import Limit from "../components/Limit";
import WaitDialog from "@/components/WaitDialog";

export default {
	name: "Limites",
	components: {
		Limit,
		WaitDialog,
	},
	data() {
		return {
			axes: [],
			lockButtons: false,
			displayMsg: "",
		};
	},
	created() {
		if (typeof pywebview !== "undefined") {
			//alert("Entro en crear");
			//return;
		}
		this.axes.push({
			number: 0,
			lastForwardLimit: 161.8,
			forwardLimit: 161.8,
			reverseLimit: 161.9,
			lastReverseLimit: 161.9,
		});
		this.axes.push({
			number: 1,
			lastForwardLimit: 161.8,
			forwardLimit: 161.8,
			reverseLimit: 161.9,
			lastReverseLimit: 161.9,
		});
	},
	methods: {
		async readLimits() {
			this.displayMsg = "Leyendo Limites";
			this.lockButtons = true;
			if (typeof pywebview !== "undefined") {
				/* eslint-disable-next-line */
				let resp = await pywebview.api.PyReadLimits();
				if (!resp) {
					alert("Error leyendo los limites");
				}
				this.axes = resp;
				this.axes.forEach((axis) => {
					axis.lastReverseLimit = axis.reverseLimit;
					axis.lastForwardLimit = axis.forwardLimit;
				});
			}
			this.lockButtons = false;
		},
		async writeLimits() {
			this.displayMsg = "Escribiendo Limites";
			this.lockButtons = true;
			//console.log(this.axes);
			if (typeof pywebview !== "undefined") {
				for (let i = 0; i < this.axes.length; i++) {
					if (
						this.axes[i].forwardLimit !==
							this.axes[i].lastForwardLimit ||
						this.axes[i].reverseLimit !==
							this.axes[i].lastReverseLimit
					) {
						/* eslint-disable-next-line */
						let resp = await pywebview.api.PyWriteLimit(
							parseInt(this.axes[i].number),
							parseFloat(this.axes[i].forwardLimit),
							parseFloat(this.axes[i].reverseLimit)
						);
						if (!resp) {
							alert(
								`Error escribiendo el limite de ${this.axes[i].number}`
							);
							return;
						}
						this.axes[i].reverseLimit = resp.reverseLimit;
						this.axes[i].lastReverseLimit = resp.reverseLimit;
						this.axes[i].forwardLimit = resp.forwardLimit;
						this.axes[i].lastForwardLimit = resp.forwardLimit;
					}
				}
			}
			console.log(this.axes);
			console.log("He terminado");
			this.lockButtons = false;
		},
	},
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