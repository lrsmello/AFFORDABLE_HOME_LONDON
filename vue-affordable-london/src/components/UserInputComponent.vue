<script setup>
import { reactive, onMounted, inject } from "vue";

const axios = inject("axios");

const dados = reactive({
  referenceBoroughId: 7,
  maximumDistanceFromReference: 100,
  incomePerMonth: 750,
  categoryPlace: 7,
  priorities: [1, 2, 3],
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

function rodar() {
  let promise = axios.post(`http://localhost:3000/api/model/run`,
    dados
  );
  promise
    .then((res) => {
      predefData.ranking.splice(0, predefData.ranking.length);
      predefData.ranking.push(...res.data.ranking);
    })
    .catch((err) => {
      console.log(err);
      Swal(err.message+ ' '+ err.response.data.error);
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
    <h1>WHERE TO LIVE IN LONDON</h1>
    <h2>
      Based on your preferences, you'll be given a list of affordable boroughs to live in.
    </h2>

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

    <div class="form-group">
      <label for="distance">Maximum distance from Reference:</label>
      <input
        type="number"
        class="form-control"
        id="distance"
        name="distance"
        required
        v-model="dados.maximumDistanceFromReference"
      />
    </div>

    <div class="form-group">
      <label for="income">Monthly income:</label>
      <input
        v-model="dados.incomePerMonth"
        type="number"
        class="form-control"
        id="income"
        name="income"
        required
      />
    </div>

    <div class="checks">
      <div v-for="p in predefData.priorities">
        <input type="checkbox" :value="p.ID" :id="p.ID" v-model="dados.priorities" />
        <label :for="p.ID">{{ p.DS_PRIORITY }}</label>
      </div>
    </div>

    <button @click="rodar" class="btn btn-primary">Submit</button>

    <ul>
      <li v-for="(r,idx) in predefData.ranking" :id="idx">{{ r.name }}</li>
    </ul>
  </div>
</template>
