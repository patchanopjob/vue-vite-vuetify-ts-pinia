import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { i18n } from "./plugins/i18n";
import { vuetify } from "./plugins/vuetify";
import router from "./router/index";
import "./styles/global.scss";
import Vue3Apexcharts from "vue3-apexcharts";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

createApp(App)
  .use(router)
  .use(vuetify)
  .use(createPinia())
  .use(i18n)
  .use(Vue3Apexcharts)
  .component("VueDatePicker", VueDatePicker)
  .mount("#app");
