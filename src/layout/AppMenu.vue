<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: '功能',
        items: [
            { label: '用户管理', icon: 'pi pi-fw pi-users', to: '/user' },
            { label: '收藏品管理', icon: 'pi pi-fw pi-box', to: '/mem' },
            { label: '订单管理', icon: 'pi pi-fw pi-truck', to: '/order' },
            { label: '统计与分析', icon: 'pi pi-fw pi-chart-bar', to: '/statistics' },
            { label: '设置', icon: 'pi pi-fw pi-cog', to: '/setting' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
