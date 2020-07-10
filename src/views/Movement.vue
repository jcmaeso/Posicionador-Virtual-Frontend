<template>
	<v-container>
        <WaitDialog :dialog="lockButtons" :msg="displayMsg"/>
		<v-row dense justify="space-around">
			<v-col sm="3">
				<v-combobox
					class="py-3"
					label="Sistema"
					dense
					item-text="name"
					return-object
					v-model="systemSelected"
					:items="systems"
				></v-combobox>
				<v-combobox
					class="py-3"
					label="Modo de movimiento"
					dense
					item-text="name"
					return-object
					v-model="movementModeSelected"
					:items="movementModes"
				></v-combobox>
				<v-btn @click="moveAxis" :disabled="lockButtons">Mover Eje</v-btn>
			</v-col>
			<v-col sm="8">
				<v-card v-if="movementModeSelected.mode === 'MT'">
					<v-row justify="space-around" dense>
						<v-col sm="4">
							<v-combobox
								item-text="number"
								class="input-centered"
								label="Eje"
								:items="systemSelected.axes"
								v-model="axisSelected"
							></v-combobox>
							<v-text-field
								class="input-centered"
								v-model="movementSpeed"
								label="Velocidad"
								outlined
								type="number"
								:rules="[speedRule]"
								v-on:blur="movementSpeedCorrect"
							></v-text-field>
						</v-col>
						<v-col sm="4">
							<v-combobox
								label="Dirección"
								item-text="name"
								class="input-centered"
								return-object
								:items="movementDirection"
								v-model="movementDirectionSelected"
							></v-combobox>
							<v-text-field
								class="input-centered"
								v-model="movementTargetPosition"
								label="Posición Objetivo"
								type="number"
								outlined
								:rules="[positionRule('movementTargetPosition')]"
								v-on:blur="movementTargetPositionCorrect('movementTargetPosition')"
							></v-text-field>
						</v-col>
					</v-row>
				</v-card>
				<v-card v-else-if="movementModeSelected.mode === 'MR'">
					<v-row justify="space-around" dense>
						<v-col sm="4">
							<v-combobox
								item-text="number"
								class="input-centered"
								label="Eje"
								:items="systemSelected.axes"
								v-model="axisSelected"
							></v-combobox>
							<v-text-field
								class="input-centered"
								v-model="movementSpeed"
								label="Velocidad"
								outlined
								type="number"
								:rules="[speedRule]"
								v-on:blur="movementSpeedCorrect"
							></v-text-field>
						</v-col>
						<v-col sm="4">
							<v-text-field
								class="input-centered"
								v-model="movementStartPosition"
								label="Posición Inicial"
								type="number"
								outlined
								:rules="[positionRule('movementStartPosition')]"
								v-on:blur="movementTargetPositionCorrect('movementStartPosition')"
							></v-text-field>
							<v-text-field
								class="input-centered"
								v-model="movementEndPosition"
								label="Posición Final"
								type="number"
								outlined
								:rules="[positionRule('movementEndPosition')]"
								v-on:blur="movementTargetPositionCorrect('movementEndPosition')"
							></v-text-field>
							<v-text-field
								class="input-centered"
								v-model="movementIncrement"
								label="Incremento Angular"
								type="number"
								outlined
								:rules="[incrementRule]"
								v-on:blur="movementIncrementCorrect"
							></v-text-field>
						</v-col>
					</v-row>
				</v-card>
                <v-card class="my-4 py-2">
					<v-row justify="space-around" dense>
						<v-col sm="4">
							<p style="font-size: 20px; font-weight: bold;">Position: {{currentPosition}}</p>
						</v-col>
						<v-col sm="4">
							<v-btn @click="readPosition" :disabled="lockButtons">Read Position</v-btn>
						</v-col>
					</v-row>
                </v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import WaitDialog from "@/components/WaitDialog"

export default {
    name: "Mover",
    components: {
        WaitDialog
    },
	data() {
		return {
			systems: [
				{
					system: "spheric",
					name: "Esférico",
					axes: [
						{ number: 1, min: 0, max: 360 },
						{ number: 3, min: 0, max: 360 },
						{ number: 4, min: 0, max: 360 },
						{ number: 5, min: 0, max: 240 }
					]
				},
				{
					system: "compact-range",
					name: "Rango compacto",
					axes: [
						{ number: 1, min: 0, max: 359.99 },
						{ number: 2, min: 0, max: 155 },
						{ number: 3, min: 0, max: 359.99 },
						{ number: 4, min: 0, max: 240 },
						{ number: 6, min: 0, max: 155 }
					]
				}
			],
			systemSelected: {},
			movementModes: [
				{ mode: "MT", name: "Modo Track" },
				{ mode: "MR", name: "Modo Registro" }
			],
			movementModeSelected: {},
			axisSelected: {},
			movementDirection: [
                { mode: "d", name: "Auto" },
				{ mode: "f", name: "Directa" },
				{ mode: "r", name: "Inversa" },
			],
			movementDirectionSelected: {},
			movementSpeed: "90.0",
			movementTargetPosition: "0.00",
			currentPosition: "0.00",
			movementStartPosition: "0.00",
			movementEndPosition: "0.00",
            movementIncrement: "0.100",
            lockButtons: false,
            displayMsg: ""
		};
	},
	methods: {
		speedRule(speed) {
			if (isNaN(speed)) {
				return "La velocidad no es un numero";
			}
			speed = parseFloat(speed);
			if (speed > 92) {
				return "La velocidad no puede ser superior a 92%";
			} else if (speed <= 0) {
				return "La velocidad no puede ser inferior a 0%";
			}
			return true;
		},
		positionRule(positionKey) {
			let position = this[positionKey];
			if (isNaN(position)) {
				return "La posición no es un numero";
			}
			position = parseFloat(position);
			if (position < this.axisSelected.min) {
				return `La posición es menor que el límite inferior ${this.axisSelected.min}`;
			} else if (position > this.axisSelected.max) {
				return `La posición es mayor que el límite superior ${this.axisSelected.max}`;
			}
			return true;
		},
		/* eslint-disable-next-line */
		incrementRule(increment) {
			if (isNaN(increment)) {
				return "El incremento no es un número";
			}
			increment = parseFloat(increment).toFixed(3);
            if (increment < 0.005) {
				return "El incremento no puede ser menor que 0.005º";
			} else if (increment > 49.999) {
				return "El incremento no puede ser mayor que 49.999º";
			} else if(((parseFloat(this.movementEndPosition)-parseFloat(this.movementStartPosition))*1000) % (increment*1000) !== 0) {
				return "Las posiciones no son multiplo del incremento";
			}
			return true;
		},
		movementIncrementCorrect() {
			if (this.incrementRule(this.movementIncrement) !== true) {
				this.movementIncrement = 0.005;
				return;
			}
			this.movementIncrement = parseFloat(this.movementIncrement).toFixed(3);
		},
		movementSpeedCorrect() {
			if (this.speedRule(this.movementSpeed) !== true) {
				this.movementSpeed = 90;
				return;
			}
			this.movementSpeed = parseFloat(this.movementSpeed).toFixed(1);
		},
		movementTargetPositionCorrect(key) {
			console.log(this[key]);
			if (this.positionRule(key) !== true) {
				this[key] = 0;
				return;
			}
			this[key] = parseFloat(this[key]).toFixed(2);
		},
		async moveAxis() {
            this.displayMsg = "Moviendo el eje"
            this.lockButtons = true
            /* eslint-disable-next-line */
			if (typeof pywebview !== "undefined") {
                let resp
				switch (this.movementModeSelected.mode) {
                    case "MT":
                        /* eslint-disable-next-line */
                        resp = await pywebview.api.PyMoveTrack(
                            this.movementDirectionSelected.mode,
                            this.movementSpeed,
                            this.movementTargetPosition,
                            this.axisSelected.number
                        )
						break;
					case "MR":
                        /* eslint-disable-next-line */
                        resp = await pywebview.api.PyMoveRegister(
                            this.movementSpeed,
                            this.movementStartPosition,
                            this.movementEndPosition,
                            this.movementIncrement,
                            this.axisSelected.number
                        )
						break;
                }
                if(!resp){
                    alert('Error moviendo el eje')
                }
                this.currentPosition = resp
            }
            this.lockButtons = false
        },
        async readPosition(){
            this.displayMsg = "Leyendo la posición"
            this.lockButtons = true
            /* eslint-disable-next-line */
			if (typeof pywebview !== "undefined") {
                /* eslint-disable-next-line */
                let resp = await pywebview.api.PyReadPosition(this.axisSelected.number)
                if(!resp){
                    alert("Error leyendo la posición")
                }
                this.currentPosition = resp
            }
            this.lockButtons = false 
        }
	},
	watch: {
		systemSelected: function(val) {
			this.systemSelected = val;
		},
		axisSelected: function(val) {
			this.axisSelected = val;
			this.readPosition();
		}
	},
	created() {
		this.systemSelected = this.systems[0];
		this.movementModeSelected = this.movementModes[0];
		this.axisSelected = this.systemSelected.axes[0]; //This triggers read position
		this.movementDirectionSelected = this.movementDirection[0];
		//this.readPosition();
	}
};
</script>

<style>
</style>