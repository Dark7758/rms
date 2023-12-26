<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { UserService } from "@/service/UserService";
import { SouvenirsService } from "@/service/SouvenirsService";
import { addSouvenirs, modifySouvenirs, removeSouvenirs, selectAllSouvenirs } from "@/api/souvenirs";
import { uploadImage } from "@/api/others";

const toast = useToast();
const products = ref(null); // 信息列表
const product = ref({}); // dialog临时信息item
const selectedProducts = ref(); // 选中的item
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);


onBeforeMount(() => {
  initFilters();
});
onMounted(async () => {
  // 初始化信息列表
  const res = await selectAllSouvenirs()
  console.log(res);
  products.value = res.data
});

/**
 * 新增用户dialog功能
 */
const addProductDialog = ref(false); // 控制新增用户dialog显隐
const customBase64Uploader = async (event) => {
  const file = event.files[0];
  // 上传头像图片
  const formData = new FormData();
  formData.append('file', file);
  product.value.imageURL = await uploadImage(formData);
};
// 打开新增的编辑窗口
const openNew = () => {
  product.value = {};
  submitted.value = false;
  addProductDialog.value = true;
};

// 提交新增用户
const addReplaceItem = ref({}); // 响应式更换项
const saveAddProduct = async () => {
  submitted.value = true;
  console.log(product.value);
  if (product.value.title  && product.value.price) {
    const { souvenirsId, title, description, price, stock, imageURL, listingDate } = product.value;
    let modifyProduct = { souvenirsId, title, description, price, stock, imageURL, listingDate }
    // 添加新用户
    const res = await addSouvenirs(modifyProduct);
    console.log(res);
    addReplaceItem.value = modifyProduct;
    if (res.status === 200) {
      products.value.push(res.data);
      toast.add({ severity: 'success', summary: 'Successful', detail: res.msg, life: 3000 });
    }else{
      toast.add({ severity: 'error', summary: 'Error', detail: res.msg, life: 3000 });
    }
  }
  addProductDialog.value = false;
  product.value = {};
};

// 关闭新增用户dialog
const hideAddDialog = () => {
  addProductDialog.value = false;
  submitted.value = false;
};

/**
 * 更新用户信息dialog功能
 */
const productDialog = ref(false); // 控制更新用户dialog显隐
// 打开更新dialog
const editProduct = (editProduct) => {
  product.value = { ...editProduct };
  product.value.isDisabled = product.value.isDisabled ? { name: '禁用', value: true } : { name: '可用', value: false };
  product.value.gender = product.value.gender === '男' ? { label: '男', value: '男' } : { label: '女', value: '女' };
  productDialog.value = true;
};

// 提交更新
// 响应式更换项
const replaceItem = ref({});
const saveProduct = async () => {
  submitted.value = true;
  if (product.value.title  && product.value.price) {
    const { souvenirsId, title, description, price, stock, imageURL, listingDate } = product.value;
    let modifyProduct = { souvenirsId, title, description, price, stock, imageURL, listingDate };
    // 修改已有的用户信息
    const res = await modifySouvenirs(modifyProduct);
    console.log(res);
    replaceItem.value = modifyProduct;
    if (res.status === 200) {
      // 使用map替换找到的项
      products.value = products.value.map((item) => (item.souvenirsId === souvenirsId ? replaceItem.value : item));
      toast.add({ severity: 'success', summary: 'Successful', detail: res.msg, life: 3000 });
    }else{
      toast.add({ severity: 'error', summary: 'Error', detail: res.msg, life: 3000 });
    }
  }
  productDialog.value = false;
  product.value = {};
};

// 关闭更新用户dialog
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

/**
 * 删除用户信息
 */
const deleteProductsDialog = ref(false); // 控制删除dialog显隐
// 确定删除dialog
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

// 删除选中的items
const deleteSelectedProducts = async () => {
  let delArr = selectedProducts.value.map((item) => item.souvenirsId);
  // 过滤删除页面列表中的数据
  products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
  const { status, msg } = await removeSouvenirs(delArr);
  if(status === 200){
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  }else{
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 3000 });
  }
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
          dataKey="souvenirsId"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <Column field="souvenirsId" header="纪念品ID" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>

          <Column field="title" header="名称"  headerStyle="width:14%; min-width:10rem;"></Column>
          <Column field="description" header="描述"  headerStyle="width:14%; min-width:10rem;"></Column>
          <Column field="imageURL" header="图片"  headerStyle="width:14%; min-width:8rem;">
            <template #body="slotProps">
              <Image :src="'http://localhost:8080/redMs_war/static/images/' + slotProps.data.imageURL" alt="Image" width="250" preview />
            </template>
          </Column>

          <Column field="price" header="价格" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              ￥{{ slotProps.data.price }}
            </template>
          </Column>

          <Column field="type" header="类型" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type.name"></Tag>
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
            <label for="imageURL">图片</label>
            <div class="flex justify-content-center">
              <Image :src="'http://localhost:8080/redMs_war/static/images/' + product.imageURL" alt="Image" width="250" preview />
              <FileUpload mode="basic" name="" url="" accept="image/*" customUpload @uploader="customBase64Uploader" />
            </div>
          </div>
          <div class="field">
            <label for="description">描述</label>
            <Textarea v-model="product.description" id="description" rows="5" cols="30" />
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
        <Dialog v-model:visible="addProductDialog" :style="{ width: '450px' }" header="新增收藏品" :modal="true" class="p-fluid">
          <div class="field">
            <label for="title">纪念品名称</label>
            <InputText id="title" v-model.trim="product.title" required="true" autofocus :class="{ 'p-invalid': submitted && !product.title }" />
            <small class="p-invalid" v-if="submitted && !product.title">title is required.</small>
          </div>
          <div class="field">
            <label for="imageURL">图片</label>
            <div class="flex justify-content-center">
              <Image :src="'http://localhost:8080/redMs_war/static/images/' + product.imageURL" alt="Image" width="250" preview />
              <FileUpload mode="basic" name="" url="" accept="image/*" customUpload @uploader="customBase64Uploader" />
            </div>
          </div>
          <div class="field">
            <label for="description">描述</label>
            <Textarea v-model="product.description" id="description" rows="5" cols="30" />
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
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideAddDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveAddProduct" />
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
