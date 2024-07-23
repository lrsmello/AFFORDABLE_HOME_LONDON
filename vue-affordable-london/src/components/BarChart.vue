<template>
  <Radar :data="chartData" :options="options" />
</template>

<script setup>
import { defineProps } from "vue";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "vue-chartjs";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const props = defineProps({
    chartData: {
        type: Object,
        default(rawProperty) {
            return []
        }
    },
    loaded: {
        type: Boolean,
        default: false
    }
});


const options = {
  responsive: true,
  maintainAspectRatio: false
};

</script>
