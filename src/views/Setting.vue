<template>
  <v-card-actions class="justify-center h-100">
    <v-row justify="center" class="flex-column" style="flex-grow: 0">
      <VueDatePicker
        v-model="date"
        locale="th"
        autoApply
        :format="format"
        placeholder="เลือกวัน"
        modelType="yyyy-MM-dd HH:mm:ss"
        position="center"
        @update:modelValue="handleDate"
      >
        <template #year="{ year }"> {{ year + 543 }}</template>
      </VueDatePicker>
      <h4 class="mt-4">ค่าที่จะนำไปใช้: {{ date }}</h4>
    </v-row>
  </v-card-actions>
</template>

<script setup lang="ts">
import { ref } from "vue";

const date = ref();

const format = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year + 543}`;
};

const handleDate = (modelData: null) => {
  date.value = modelData;
  if (date.value != null) {
    console.log(date.value);
  }
};
</script>

<style scoped></style>
