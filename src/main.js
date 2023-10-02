import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


createApp(App)
.use(
    Vue3Toasity,
    {
      autoClose: 3000,
    } 
)
.mount('#app')
