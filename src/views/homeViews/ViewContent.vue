<script setup>
import { ref, onMounted, watch } from "vue";
import ProductService from '@/service/ProductService';
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { f } from "../../../dist/assets/index-e67f824e";
import { selectAllSouvenirs, selectAllSouvenirsByType } from "@/api/souvenirs";



const dataviewValue = ref(null);
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
  { label: '价格递减', value: '!price' },
  { label: '价格递增', value: 'price' }
]);

const productService = new ProductService();

const route = useRoute()
const typeId = ref(null)

onMounted(async () => {
  typeId.value = route.query.type
  if(typeId.value > 0) {
    const res = await selectAllSouvenirsByType(typeId.value)
    dataviewValue.value = res.data
  }else {
    const res = await selectAllSouvenirs()
    dataviewValue.value = res.data

  }

});


onBeforeRouteUpdate(async (to) =>{
  typeId.value = to.query.type
  if(typeId.value > 0) {
    const res = await selectAllSouvenirsByType(typeId.value)
    dataviewValue.value = res.data
  }else {
    const res = await selectAllSouvenirs()
    dataviewValue.value = res.data
  }
})

const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  } else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>收藏品列表</h5>
        <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
          <template #header>
            <div class="grid grid-nogutter">
              <div class="col-6 text-left">
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="默认排序" @change="onSortChange($event)" />
              </div>
              <div class="col-6 text-right">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
          </template>
          <template #list="slotProps">
            <div class="col-12">
              <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                <img :src="'http://localhost:8080/redMs_war/static/images/' + slotProps.data.imageURL" :alt="slotProps.data.title" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                <div class="flex-1 text-center md:text-left">
                  <div class="font-bold text-2xl">{{ slotProps.data.title }}</div>
                  <div class="mb-3">{{ slotProps.data.description }}</div>
<!--                  <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" class="mb-2"></Rating>-->
                  <div class="flex align-items-center">
                    <i class="pi pi-tag mr-2"></i>
                    <span class="font-semibold"> {{ slotProps.data.type.name }}</span>
                  </div>
                </div>
                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                  <span class="text-2xl font-semibold mb-2 align-self-center md:align-self-end">￥{{ slotProps.data.price }}</span>
                  <Button icon="pi pi-shopping-cart" label="加入购物车"  class="mb-2"></Button>
<!--                  <span :class="'product-badge status-' + slotProps.data.inventoryStatus.toLowerCase()">{{ slotProps.data.inventoryStatus }}</span>-->
                </div>
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="col-12 md:col-4">
              <div class="card m-3 border-1 surface-border">
                <div class="flex align-items-center justify-content-between">
                  <div class="flex align-items-center">
                    <i class="pi pi-tag mr-2"></i>
                    <span class="font-semibold">{{ slotProps.data.type.name  }}</span>
                  </div>
                  <span :class="'product-badge'">库存 {{ slotProps.data.stock }}</span>
                </div>
                <div class="text-center">
                  <img :src="'http://localhost:8080/redMs_war/static/images/' + slotProps.data.imageURL" :alt="slotProps.data.title" class="w-9 shadow-2 my-3 mx-0" />
                  <div class="text-2xl font-bold">{{ slotProps.data.title }}</div>
                  <div class="mb-3">{{ slotProps.data.description }}</div>
<!--                  <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false"></Rating>-->

                </div>
                <div class="flex align-items-center justify-content-between">
                  <span class="text-2xl font-semibold">￥{{ slotProps.data.price }}</span>
                  <Button icon="pi pi-shopping-cart" ></Button>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
