import { languages } from "@/locales";
import { createI18n } from "vue-i18n";

let local_store_lang = "en";

if (localStorage.getItem("lang_store") !== null) {
  local_store_lang = localStorage.getItem("lang_store")?.toString() || "en";
}

export const i18n = createI18n({
  locale: local_store_lang,
  fallbackLocale: local_store_lang,
  legacy: false,
  messages: languages,
});
