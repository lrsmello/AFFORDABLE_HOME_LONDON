<script setup>
import { reactive, onMounted, inject, ref } from "vue";
import BarChart from "./BarChart.vue";
const axios = inject("axios");

const dados = reactive({
  referenceBoroughId: 7,
  maximumDistanceFromReference: 5,
  incomePerMonth: 3500,
  categoryPlace: 7,
  priorities: [1, 2, 3, 4, 5],
});

const predefData = reactive({
  ranking: [],
  borougs: [],
  categories: [],
  priorities: [
    { ID: 1, DS_PRIORITY: "Rent Price", NU_DIRECTION: -1 },
    { ID: 2, DS_PRIORITY: "Distance", NU_DIRECTION: -1 },
    { ID: 3, DS_PRIORITY: "Well Being", NU_DIRECTION: 1 },
    { ID: 4, DS_PRIORITY: "Travelling Time", NU_DIRECTION: -1 },
    { ID: 5, DS_PRIORITY: "Cost of Living", NU_DIRECTION: -1 },
  ],
});
const loaded = ref(false);
const data = reactive({
  labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgba(179,181,198,0.2)",
      borderColor: "rgba(179,181,198,1)",
      pointBackgroundColor: "rgba(179,181,198,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(179,181,198,1)",
      data: [65, 59, 90, 81, 56, 55, 40],
    },
    {
      label: "My Second dataset",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      pointBackgroundColor: "rgba(255,99,132,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(255,99,132,1)",
      data: [28, 48, 40, 19, 96, 27, 100],
    },
  ],
});

function getRandomRGB() {
  let r = Math.round(Math.random() * 255);
  let g = Math.round(Math.random() * 255);
  let b = Math.round(Math.random() * 255);
  return `${r},${g},${b}`;
}
function getColorFromRgba(rgb, alpha = 1) {
  return `rgba(${rgb},${alpha})`;
}

async function updateDatasetChart() {
  data.labels.splice(0, data.labels.length);
  data.datasets.splice(0, data.datasets.length);
  data.labels.push(...Object.keys(predefData.ranking[0].features));
  let three = predefData.ranking.filter((v, k) => k < 3);
  let dataset = three.map((info) => {
    let cor = getRandomRGB();
    return {
      label: info.name,
      backgroundColor: getColorFromRgba(cor, 0.2),
      borderColor: getColorFromRgba(cor),
      pointBackgroundColor: getColorFromRgba(cor),
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: getColorFromRgba(cor),
      data: Object.values(info.normalizedFeatures),
    };
  });
  data.datasets.push(...dataset);
}

function rodar() {
  loaded.value = false;
  dados.maximumDistanceFromReference = parseInt(dados.maximumDistanceFromReference);
  let promise = axios.post(`http://localhost:3000/api/model/run`, dados);
  promise
    .then(async (res) => {
      predefData.ranking.splice(0, predefData.ranking.length);
      predefData.ranking.push(...res.data.ranking);
      await updateDatasetChart();
      loaded.value = true;
    })
    .catch((err) => {
      console.log(err);
      Swal(err.message + " " + err.response.data.error);
    });
}

onMounted(() => {
  let promise = axios.get(`http://localhost:3000/api/util/boroughs`);
  promise
    .then((res) => {
      predefData.borougs.splice(0, predefData.borougs.length);
      predefData.borougs.push(...res.data);
    })
    .catch((err) => {
      Swal(err.message);
    });
  let promise1 = axios.get(`http://localhost:3000/api/util/categories`);
  promise1
    .then((res) => {
      predefData.categories.splice(0, predefData.categories.length);
      predefData.categories.push(...res.data);
    })
    .catch((err) => {
      Swal(err.message);
    });
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1>WHERE TO LIVE IN LONDON</h1>
        <h2>
          Based on your preferences, you'll be given a list of affordable boroughs to live
          in.
        </h2>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-6">
        <div class="form-group">
          <label for="dimPriority">Priority:</label>
          <div
            id="dimPriority"
            class="form-check form-check-inline"
            name="dimPriority"
            required
          ></div>
        </div>

        <div class="form-group">
          <label for="borough">Reference Borough:</label>
          <select
            @change="rodar"
            v-model="dados.referenceBoroughId"
            class="form-control"
            id="borough"
            name="borough"
            required
          >
            <option v-for="b in predefData.borougs" :key="b.ID" :value="b.ID">
              {{ b.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="dimCategoryRoom">Reference category:</label>
          <select
            @change="rodar"
            v-model="dados.categoryPlace"
            class="form-control"
            id="dimCategoryRoom"
            name="dimCategoryRoom"
            required
          >
            <option v-for="c in predefData.categories" :value="c.ID" :key="c.ID">
              {{ c.DS_CATEGORY }}
            </option>
          </select>
        </div>

        <div class="form-group mt-3">
          <label for="distance"
            >Maximum distance from Reference ({{
              dados.maximumDistanceFromReference
            }}
            KM):</label
          >
          <input
            @change="rodar"
            type="range"
            class="form-range"
            id="distance"
            name="distance"
            min="0"
            max="100"
            step="1"
            required
            v-model="dados.maximumDistanceFromReference"
          />
        </div>

        <div class="form-group">
          <label for="income">Monthly income £:</label>
          <input
            @change="rodar"
            v-model="dados.incomePerMonth"
            type="number"
            class="form-control"
            id="income"
            name="income"
            required
          />
        </div>

        <div class="checks mt-3">
          <div
            v-for="p in predefData.priorities"
            class="form-check form-switch form-check-inline"
          >
            <input
              @change="rodar"
              class="form-check-input"
              type="checkbox"
              role="switch"
              :value="p.ID"
              :id="p.ID"
              v-model="dados.priorities"
            />
            <label class="form-check-label" :for="p.ID">{{ p.DS_PRIORITY }}</label>
          </div>
        </div>
        <button @click="rodar" class="btn mt-3 btn-primary">Atualizar</button>
      </div>
      <div class="col-6">
        <BarChart :loaded="loaded" :chart-data="data"></BarChart>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
          <symbol id="check" viewBox="0 0 16 16">
            <title>Check</title>
            <path
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
            />
          </symbol>
        </svg>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Decription</th>
              <th scope="col">Is affordable rent</th>
              <th scope="col">Is inside distance</th>
              <th scope="col">Is inside cost of living</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, idx) in predefData.ranking"
              :id="idx"
              :class="{
                'table-warning': r.isReferenceBorough,
                'table-success': r.isInsideDistance,
                'table-info': r.isAffordableRent,
              }"
            >
              <td>{{ r.name }}</td>
              <td>{{ r.description }}</td>
              <td>
                <svg v-if="r.isAffordableRent" class="bi" width="24" height="24">
                  <use xlink:href="#check"></use>
                </svg>
              </td>
              <td>
                <svg v-if="r.isInsideDistance" class="bi" width="24" height="24">
                  <use xlink:href="#check"></use>
                </svg>
              </td>
              <td>
                <svg v-if="r.isInsideCostOfLiving" class="bi" width="24" height="24">
                  <use xlink:href="#check"></use>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
