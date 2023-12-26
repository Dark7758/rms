<template>

    <div class="card col-8">
      <h5>我的购物车</h5>
      <DataView :value="products">
        <template #list="slotProps">
          <div class="grid">
          <div class="col-12">
            <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
              <img :src="'http://localhost:8080/redMs_war/static/images/' + slotProps.data.souvenirs.imageURL" :alt="slotProps.data.souvenirs.title" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
              <div class="flex-1 text-center md:text-left">
                <div class="font-bold text-2xl">{{ slotProps.data.souvenirs.title }}</div>
                <div class="mb-3">{{ slotProps.data.souvenirs.description }}</div>
                <!--                  <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" class="mb-2"></Rating>-->
                <div class="flex align-items-center">
                  <!--                <i class="pi pi-tag mr-2"></i>-->
                  <!--&lt;!&ndash;                <span class="font-semibold"> {{ slotProps.data.type.name }}</span>&ndash;&gt;-->
                </div>
              </div>
              <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                <span class="text-2xl font-semibold mb-2 align-self-center md:align-self-end">￥{{ slotProps.data.souvenirs.price }}</span>
                <Button icon="pi pi-trash" label="删除" text raised severity="danger" class="mb-1"></Button>
                <!--                  <span :class="'product-badge status-' + slotProps.data.inventoryStatus.toLowerCase()">{{ slotProps.data.inventoryStatus }}</span>-->
              </div>
            </div>
          </div>
          </div>
        </template>
      </DataView>
    </div>

    <div class="cart col-4">




  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "@/stores";
import { getAllCarts } from "@/api/cart";

onMounted(async() => {
  const id = userStore().user.userId
  const res =  await getAllCarts(id)
  console.log(res);
  products.value = res.data
});

const products = ref();
const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warning';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
};
</script>
