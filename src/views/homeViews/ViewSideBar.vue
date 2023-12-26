<script setup>
import { onMounted, ref } from "vue";

import AppMenuItem from '@/layout/AppMenuItem.vue';
import { getTypeList } from "@/api/type";

const model = ref([
  {
    label:'主页',
    items:[{ label:'所有商品',icon:'pi pi-fw pi-align-left',to:'/view?type=0' }]
  },
  {
    label: '分类',
    items: [
    ]
  },{
    label: '我的',
    items: [
      { label:'购物车',icon:'pi pi-fw pi-shopping-cart',to:'/cart' },
      { label:'订单',icon:'pi pi-fw pi-verified',to:'/userOrder' }
    ]
  }
]);
const typeIcons = ref(['pi pi-fw pi-briefcase','pi pi-fw pi-prime','pi pi-fw pi-slack','pi pi-fw pi-box','pi pi-fw pi-slack'])
const types = ref([])
onMounted(async ()=>{
  const res = await getTypeList()
  console.log(res);
  types.value = res.data
  model.value[1].items.push(
    ...types.value.map(
      (item,index) => {
        return {
          label: item.name,
          icon:typeIcons.value[index],
          to:`/view?type=${item.typeId}`
        }
      }))
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>

</style>
