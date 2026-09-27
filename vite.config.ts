import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "vue-router/vite";
import VueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    VueRouter({
      routesFolder: "src/pages",
      dts: "typed-router.d.ts",
    }),
    // Vue must be placed AFTER VueRouter()
    Vue(),
    VueDevTools(),
    AutoImport({
      dirs: ["./src/composables", "./src/utils", "./src/types/labels", "./src/stores", "./src/services"],
      imports: ["pinia", "vue", "vue-router", "@vueuse/core"],
      vueTemplate: true,
      dts: true,
      eslintrc: {
        enabled: true,
        filepath: "./auto-import.json",
        globalsPropValue: true,
      },
    }),
    Components({
      dts: true,
      deep: true,
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "WRS",
        short_name: "WRS",
        theme_color: "#0f766e",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
