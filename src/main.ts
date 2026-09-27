import "@/assets/style.css";

import pinia from "@/pinia";
import router from "@/router";
import { i18n } from "@/i18n";

import App from "./App.vue";

const app = createApp(App).use(pinia).use(router).use(i18n);

router.isReady().then(() => app.mount("#app"));
