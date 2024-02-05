<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
          title="John Doe"
          subtitle="jogn@email.com"
          class="pa-md-8"
        >
          <template v-slot:append>
            <v-btn size="small" variant="text" icon="mdi-menu-down"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          value="dashboard"
          to="/dashboard"
          >{{ t("menu_dashboard") }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-storefront"
          value="products"
          to="/product"
          >{{ t("menu_product") }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-cart" value="orders" to="/order"
          >{{ t("menu_order") }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-chart-areaspline"
          value="reports"
          to="/report"
          >{{ t("menu_report") }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-cog" value="settings" to="/setting"
          >{{ t("menu_setting") }}
        </v-list-item>
      </v-list>
      <v-divider class="mt-16"></v-divider>
      <v-list nav>
        <v-list-item prepend-icon="mdi-logout-variant" value="logout"
          >{{ t("menu_logout") }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ t(`${meta.header}`) }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn class="text-none" stacked @click="clearCount">
        <v-badge v-if="count.total > 0" color="error" :content="count.total">
          <v-icon>mdi-store-outline</v-icon>
        </v-badge>
        <v-icon v-else>mdi-store-outline</v-icon>
      </v-btn>

      <v-menu open-on-click>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props"
            >{{ t("languages") }}
            <v-icon small right icon="mdi-menu-down" />
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(value, key) in langs" :key="key">
            <v-btn block variant="plain" @click="handleMenuItemClick(key)">{{
              value
            }}</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        prepend-icon="mdi-white-balance-sunny"
        @click="toggleTheme"
        v-if="!theme.global.current.value.dark"
        >Light</v-btn
      >
      <v-btn prepend-icon="mdi-moon-waning-crescent" @click="toggleTheme" v-else
        >Dark</v-btn
      >
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { db } from "@/plugins/firebase";
import router from "@/router";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ThemeInstance, useTheme } from "vuetify";

const count: any = ref(0);

onMounted(() => {
  db.collection("product_counts").onSnapshot((querySnapshot) => {
    count.value = querySnapshot.docs[0].data();
  });
});

const langs: langsType = {
  en: "English",
  th: "ไทย",
  la: "ລາວ",
  kr: "한국어",
};

const route = useRoute();

const clearCount = () => {
  router.push("/product");
  db.collection("product_counts").doc("p_count").update({ total: 0 });
};

const meta = computed(() => route.meta);

const { locale, t } = useI18n({ inheritLocale: true, useScope: "global" });

const drawer = ref(true);
const activeLang = ref(
  langs[`${locale.value}` as keyof langsType] || "Languages"
);

const theme: ThemeInstance = useTheme();

if (localStorage.getItem("theme_store") != null) {
  theme.global.name.value =
    localStorage.getItem("theme_store")?.toString() || "light";
} else {
  theme.global.name.value = "light";
}

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  localStorage.setItem("theme_store", theme.global.name.value);
};

type langsType = {
  en: string;
  th: string;
  la: string;
  kr: string;
};

const handleMenuItemClick = (lang: keyof langsType) => {
  activeLang.value = langs[lang];
  locale.value = lang;

  localStorage.setItem("lang_store", lang);
};
</script>

<style scoped></style>
