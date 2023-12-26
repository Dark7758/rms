
<template>
  <div class="card">
    <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="3000">
      <template #item="slotProps">
        <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
          <div class="mb-3">
            <img :src="'http://localhost:8080/redMs_war/static/images/' + slotProps.data.imageURL" :alt="slotProps.data.title" class="w-6 shadow-2" />
          </div>
          <div>
            <h4 class="mb-1">{{ slotProps.data.title }}</h4>
            <h6 class="mt-0 mb-3">价格：￥{{ slotProps.data.price }}</h6>
            <h6 class="mt-0 mb-3">库存：{{ slotProps.data.stock }}</h6>
<!--            <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" />-->
            <div class="mt-5 flex align-items-center justify-content-center gap-2">
              <Button icon="pi pi-search" rounded />
              <Button icon="pi pi-star-fill" rounded severity="secondary" />
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { selectAllSouvenirs } from "@/api/souvenirs";


onMounted(async () => {
  const res = await selectAllSouvenirs()
  console.log(res);
  products.value = res.data
})

const products = ref();
const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
  }
]);

const getSeverity = (status) => {
  switch (status) {
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
