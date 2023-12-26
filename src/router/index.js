import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { adminStore } from '@/stores';
import { userStore } from "@/stores/modules/user";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: '/main',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/user',
                    name: 'userManager',
                    component: () => import('@/views/userManager/UserManager.vue')
                },
                {
                    path: '/mem',
                    name: 'memManager',
                    component: () => import('@/views/memManager/MenManager.vue')
                },
                {
                    path: '/order',
                    name: 'orderManager',
                    component: () => import('@/views/orderManager/OrderManager.vue')
                },
                {
                    path: '/statistics',
                    name: 'statistics',
                    component: () => import('@/views/statistics/StatisticsAll.vue')
                },
                {
                    path: '/setting',
                    name: 'setting',
                    component: () => import('@/views/adminSetting/AdminSetting.vue')
                }
            ]
        },{
            path: '/',
            redirect:'/view',
            name: 'view',
            component: () => import('@/views/homeViews/SouHome.vue'),
            children: [{
                path: '/view',
                name: 'content',
                component: () => import('@/views/homeViews/ViewContent.vue'),
                props: true, // 将动态路由参数传递给组件
            },
                {
                    path:'/cart',
                    name: 'cart',
                    component: () => import('@/views/homeViews/MyCart.vue')
                },
                {
                    path:'/userOrder',
                    name: 'userOrder',
                    component: () => import('@/views/homeViews/MyOrder.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

/**
 * 前置导航守卫
 */

router.beforeEach((to, from, next) => {
    const { token: { tokenStr }, tokenEndTime } = adminStore();
    // const userStores = userStore();

    // 判断token字符串是否为空，而且访问非登录页
    if (!tokenStr && to.path !== '/login') {
         next('/login');
         return;
    }
    // 判断token是否过期，而且访问非登录页
    if(tokenStr && new Date() > tokenEndTime && to.path !== '/login'){
        next('/login');
        return;
    }

    next();
});

export default router;
