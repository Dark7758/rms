<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import { useLayout } from '@/layout/composables/layout';
import { createRouter, useRouter } from "vue-router";
import { adminStore } from "@/stores";
import { a } from "../../dist/assets/index-e67f824e";

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const adminStores = adminStore()

const admin = ref()
onMounted(async() => {
  admin.value = await adminStores.admin
    bindOutsideClickListener();
  console.log(admin.value);
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});


const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

// 用户信息右侧抽屉栏
const visibleRight = ref(false)
const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
  visibleRight.value = true
};


const logout = () => {
  adminStore().adminLogout()
  router.push('/login')
}
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>SAKAI</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button" >
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>

  <Sidebar v-model:visible="visibleRight" header="Right Sidebar" position="right">
    <p></p>
    <div class="flex justify-content-center marginBottom">
      <Avatar :image="`http://localhost:8080/redMs_war/static/images/${adminStore().admin.avatar}`" size="xlarge" shape="circle"/>
    </div>
    <p class="flex justify-content-center marginBottom">{{ adminStore().admin.nickname}}</p>
    <Button @click="logout">退出账号</Button>
  </Sidebar>
</template>

<style  scoped>
.marginBottom{
  margin-bottom:10px;
}
</style>
