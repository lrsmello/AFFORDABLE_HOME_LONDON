import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.css'
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { createApp } from 'vue'

import App from './App.vue'
const app = createApp(App)

app.use(VueAxios, axios);
app.use(VueSweetalert2);
window.Swal = app.config.globalProperties.$swal;

app.provide('axios', app.config.globalProperties.axios);


app.mount('#app')
