<script setup>
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig, layoutState, isSidebarActive } = useLayout();
import AppSidebar from "@/layout/AppSidebar.vue";
import AppFooter from "@/layout/AppFooter.vue";
import AppTopbar from "@/layout/AppTopbar.vue";
import AppConfig from "@/layout/AppConfig.vue";
import { computed } from "vue";
import ViewSideBar from "@/views/homeViews/ViewSideBar.vue";
import ViewBanner from "@/views/homeViews/ViewBanner.vue";

const containerClass = computed(() => {
  return {
    'layout-theme-light': layoutConfig.darkTheme.value === 'light',
    'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
    'layout-overlay': layoutConfig.menuMode.value === 'overlay',
    'layout-static': layoutConfig.menuMode.value === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive.value,
    'layout-mobile-active': layoutState.staticMenuMobileActive.value,
    'p-input-filled': layoutConfig.inputStyle.value === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple.value
  };
});
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <div class="sidebar">
      <ViewSideBar></ViewSideBar>
    </div>
    <div class="layout-main-container">
<!--      <div class="layout-banner">-->
<!--        <ViewBanner></ViewBanner>-->
<!--      </div>-->
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <app-config></app-config>
    <div class="layout-mask"></div>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  width: 300px;
  height: calc(100vh - 19rem);
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 7rem;
  left: 2rem;
  transition: transform 0.2s, left 0.2s;
  background-color: var(--surface-overlay);
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
