<template>
  <v-toolbar>
    <v-toolbar-title>{{ t("menu_product") }}</v-toolbar-title>
    <v-btn
      color="success"
      prepend-icon="mdi-plus-circle-outline"
      @click="openAddDialog"
      >{{ t("add_product") }}</v-btn
    >
  </v-toolbar>

  <v-table>
    <thead>
      <tr>
        <th class="text-left" style="background-color: teal; color: #fff">#</th>
        <th class="text-left" style="background-color: teal; color: #fff">
          {{ t("product_name") }}
        </th>
        <th class="text-left" style="background-color: teal; color: #fff">
          {{ t("product_price") }}
        </th>
        <th class="text-end" style="background-color: teal; color: #fff">
          {{ t("product_manage") }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.price }}</td>
        <td class="text-end">
          <v-btn
            color="info"
            icon="mdi-pencil"
            size="x-small"
            class="mr-2"
            @click="openEditDialog(product)"
          ></v-btn>
          <v-btn
            color="error"
            icon="mdi-delete"
            size="x-small"
            @click="openDeleteDialog(product.id)"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-dialog v-model="dialog" persistent max-width="300px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{
          updateState ? t("edit_product") : t("add_product")
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              :label="t('product_name')"
              required
              v-model="product.name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :label="t('product_price') + ' (USD)'"
              required
              v-model="product.price"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="closeDialog">{{ t("btn_close") }}</v-btn>
        <v-btn color="blue-darken-1" @click="addProduct" v-if="!updateState">{{
          t("btn_save")
        }}</v-btn>
        <v-btn color="blue-darken-1" @click="updateProduct" v-else>{{
          t("btn_update")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_delete" persistent max-width="300px">
    <v-card
      ><v-card-title
        ><span class="text-h5">{{
          t("msg_confirm_del_title")
        }}</span></v-card-title
      >
      <v-card-text>{{ t("msg_confirm_del_subtitle") }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog_delete = false">{{ t("btn_no") }}</v-btn>
        <v-btn color="red" @click="deleteProduct">{{
          t("btn_yes_delete")
        }}</v-btn>
      </v-card-actions></v-card
    >
  </v-dialog>
</template>

<script setup lang="ts">
import { db } from "@/plugins/firebase";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

let { t } = useI18n({
  inheritLocale: true,
  useScope: "global",
});

const products: any = ref([]);

const productTemp: any = ref({});

const updateState = ref(false);

const dialog = ref(false);
const dialog_delete = ref(false);

const product_id = ref("");

const product = ref({
  name: "",
  price: "",
});

const count: any = ref(0);

const closeDialog = () => {
  dialog.value = false;
};

const openAddDialog = () => {
  updateState.value = false;
  dialog.value = true;

  product.value.name = "";
  product.value.price = "";
};

const openEditDialog = (prdTemp: any) => {
  dialog.value = true;

  updateState.value = true;

  productTemp.value = prdTemp;
  product.value.name = prdTemp.name;
  product.value.price = prdTemp.price;
};

onMounted(() => {
  db.collection("products")
    .orderBy("created_at", "desc")
    .onSnapshot((querySnapshot: any) => {
      products.value = [];
      querySnapshot.forEach((doc: any) => {
        products.value.push(doc.data());
      });
    });

  db.collection("product_counts").onSnapshot((querySnapshot) => {
    count.value = querySnapshot.docs[0].data();
  });
});

const addProduct = () => {
  db.collection("products")
    .add({
      id: "",
      name: product.value.name,
      price: product.value.price,
      created_at: Date.now(),
    })
    .then((docRef) => {
      console.log(docRef.id);
      db.collection("products").doc(docRef.id).update({ id: docRef.id });
    });

  product.value.name = "";
  product.value.price = "";

  db.collection("product_counts")
    .doc("p_count")
    .update({ total: count.value.total + 1 });
  closeDialog();
};

const updateProduct = () => {
  let p = product.value;
  db.collection("products").doc(productTemp.value.id).update({
    name: p.name,
    price: p.price,
  });

  dialog.value = false;
};

const openDeleteDialog = (pid: string) => {
  dialog_delete.value = true;
  product_id.value = pid;
};

const deleteProduct = () => {
  db.collection("products").doc(product_id.value).delete();

  db.collection("product_counts")
    .doc("p_count")
    .update({ total: count.value.total - 1 });
  dialog_delete.value = false;
};
</script>

<style scoped></style>
