<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { UserService } from "@/service/UserService";
import { SouvenirsService } from "@/service/SouvenirsService";

const toast = useToast();

const products = ref(null); // 信息列表
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({}); // 信息item
const selectedProducts = ref(); // 选中的item
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
// 下拉列表项数组
const statuses = ref([
  {label:'男',value:'男'},
  {label:'女',value:'女'}
]);

onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  // 初始化信息列表
  SouvenirsService.getSouvenirsData().then((data) => (products.value = data));
});

// 打开新的编辑窗口
const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};

// 关闭dialog
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

// 保存百年祭
const saveProduct = () => {
  submitted.value = true;
      products.value.push(product.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      console.log(product.value);

    productDialog.value = false;
    product.value = {};

};

const editProduct = (editProduct) => {
  product.value = { ...editProduct }
  productDialog.value = true;
};

// 删除item
const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};



const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

// 删除选中的items
const deleteSelectedProducts = () => {
  products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  };
};
// 处理日期格式
const dateFormat = (dateString) =>
  new Date(dateString)
    .toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replace(/\//g, '-');
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
            </div>
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          :value="products"
          v-model:selection="selectedProducts"
          dataKey="userId"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <Column field="SouvenirsId" header="纪念品ID" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>

          <Column field="title" header="名称"  headerStyle="width:14%; min-width:10rem;"></Column>

          <Column field="imageUrl" header="图片"  headerStyle="width:14%; min-width:8rem;">
            <template #body="slotProps">
            </template>
          </Column>

          <Column field="price" header="价格" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              ￥{{ slotProps.data.price }}
            </template>
          </Column>

          <Column field="stock" header="库存"  headerStyle="width:14%; min-width:10rem;"></Column>

          <Column field="listingDate" header="上架日期"  headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ dateFormat(slotProps.data.listingDate) }}
            </template>
          </Column>



          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="收藏品详情" :modal="true" class="p-fluid">
          <div class="field">
            <label for="title">纪念品名称</label>
            <InputText id="title" v-model.trim="product.title" required="true" autofocus :class="{ 'p-invalid': submitted && !product.title }" />
            <small class="p-invalid" v-if="submitted && !product.title">title is required.</small>
          </div>
          <div class="field">
            <label for="price">价格</label>
            <InputNumber v-model="product.price" inputId="currency-us" mode="currency" currency="CNY" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }"/>
            <small class="p-invalid" v-if="submitted && !product.price">price is required.</small>
          </div>

          <div class="field">
            <label for="stock">库存</label>
            <InputNumber v-model="product.stock" inputId="integeronly" required="true" autofocus :class="{ 'p-invalid': submitted && !product.stock }"/>
            <small class="p-invalid" v-if="submitted && !product.stock">stock is required.</small>
          </div>

          <div class="field">
            <label class="mb-3">上架日期</label>
            <Calendar v-model="product.listingDate" dateFormat="yy-mm-dd" />
          </div>


          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
            >Are you sure you want to delete <b>{{ product.name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
