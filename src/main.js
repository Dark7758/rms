import router from './router';
import pinia from '@/stores/index'
import '@/utils/primeVue'
import app from "@/utils/primeVue";
import '@/assets/styles.scss';

app.use(pinia)
app.use(router);
app.mount('#app');
