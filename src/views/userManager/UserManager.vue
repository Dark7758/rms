<script setup>
import { FilterMatchMode } from 'primevue/api';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { addUser, modifyUser, removeUser, selectAllUsers } from '@/api/user';
import { uploadImage } from '@/api/others';

const toast = useToast();
const products = ref(null); // 信息列表
const product = ref({}); // dialog临时信息item
const selectedProducts = ref(); // 选中的item
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const avatar = ref(null);

// 下拉列表项数组
const statuses = ref([
    { label: '男', value: '男' },
    { label: '女', value: '女' }
]);
const option = ref([
    { name: '可用', value: false },
    { name: '禁用', value: true }
]);
onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    // 初始化信息列表
    const res = await selectAllUsers();
    products.value = res.data;
});

/**
 * 新增用户dialog功能
 */
const addProductDialog = ref(false); // 控制新增用户dialog显隐

// 打开新增的编辑窗口
const openNew = () => {
    product.value = {};
    submitted.value = false;
    addProductDialog.value = true;
};

// 提交新增用户
const addReplaceItem = ref({}); // 响应式更换项
const customBase64Uploader = async (event) => {
    const file = event.files[0];
    // 上传头像图片
    const formData = new FormData();
    formData.append('file', file);
    product.value.avatar = await uploadImage(formData);
};
const saveAddProduct = async () => {
    submitted.value = true;
    if (product.value.username.trim() && product.value.nickname.trim() && product.value.gender) {
        const { userId, username, password, nickname, gender, birthday, avatar, email, registrationDate, isDisabled } = product.value;

        let modifyProduct = {
            userId,
            username,
            password,
            nickname,
            gender: gender.value,
            birthday,
            avatar,
            email,
            registrationDate,
            isDisabled: isDisabled.value
        };

        // 添加新用户
        const res = await addUser(modifyProduct);
        console.log(res);
        addReplaceItem.value = modifyProduct;
        if (res.status === 200) {
            products.value.push(res.data);
            toast.add({ severity: 'success', summary: 'Successful', detail: res.msg, life: 3000 });
        } else {
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
    if (product.value.username.trim() && product.value.nickname.trim() && product.value.gender) {
        const { userId, username, password, nickname, gender, birthday, email, avatar, registrationDate, isDisabled } = product.value;
        let modifyProduct = {
            userId,
            username,
            password,
            nickname,
            gender: gender.value,
            birthday,
            email,
            avatar,
            registrationDate,
            isDisabled: isDisabled.value
        };
        // 修改已有的用户信息
        const res = await modifyUser(modifyProduct);
        // console.log(res);
        replaceItem.value = modifyProduct;
        if (res.status === 200) {
            // 使用map替换找到的项
            products.value = products.value.map((item) => (item.userId === userId ? replaceItem.value : item));
            toast.add({ severity: 'success', summary: 'Successful', detail: res.msg, life: 3000 });
        } else {
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
    let delArr = selectedProducts.value.map((item) => item.userId);
    // 过滤删除页面列表中的数据
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    const { status, msg } = await removeUser(delArr);
    if (status === 200) {
        deleteProductsDialog.value = false;
        selectedProducts.value = null;
        toast.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
    } else {
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
const dateFormat = (dateString) =>
    new Date(dateString)
        .toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        .replace(/\//g, '-');

// 将base64转化为 byte数组
// const convertToByteArray = (base64String) => {
//   const decodedData = atob(base64String);
//   let byteArray = []
//   const byteArrays = new Uint8Array(decodedData.length);
//   for (let i = 0; i < decodedData.length; i++) {
//     byteArray[i] = decodedData.charCodeAt(i);
//   }
//   byteArray = byteArrays;
//   console.log(byteArray);
//   return byteArray
// }
// const convertBase64ToByteArray = (base64) => {
//   let binary_string = window.atob(base64);//解码使用base64编码的字符串
//   let len = binary_string.length;			//获取长度
//   let bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binary_string.charCodeAt(i);
//   }
//   console.log(bytes)     //打印解析出来的byte
//   return bytes.buffer;
// }
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

                    <!--                    <Column field="userId" header="用户ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">-->
                    <!--                        <template #body="slotProps">-->
                    <!--                            &lt;!&ndash;              <span class="p-column-title">Code</span>&ndash;&gt;-->
                    <!--                            {{ slotProps.data.userId }}-->
                    <!--                        </template>-->
                    <!--                    </Column>-->
                    <Column field="username" header="用户名" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.username }}
                        </template>
                    </Column>

                    <Column field="avatar" header="头像" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Avatar :image="'http://localhost:8080/redMs_war/static/images/' + slotProps.data.avatar" class="mr-2" size="xlarge" shape="circle" />
                        </template>
                    </Column>

                    <Column field="nickname" header="昵称" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.nickname }}
                        </template>
                    </Column>

                    <Column field="gender" header="性别" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.gender }}
                        </template>
                    </Column>

                    <Column field="email" header="邮箱" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.email }}
                        </template>
                    </Column>

                    <Column field="birthday" header="生日" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ dateFormat(slotProps.data.birthday) }}
                        </template>
                    </Column>

                    <!--                    <Column field="registrationDate" header="注册日期" headerStyle="width:14%; min-width:10rem;">-->
                    <!--                        <template #body="slotProps">-->
                    <!--                            {{ dateFormat(slotProps.data.registrationDate) }}-->
                    <!--                        </template>-->
                    <!--                    </Column>-->

                    <Column field="password" header="密码" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Password :modelValue="slotProps.data.password" disabled toggleMask />
                        </template>
                    </Column>

                    <Column field="isDisabled" header="是否禁用" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :severity="slotProps.data.isDisabled ? 'danger' : ''" :value="slotProps.data.isDisabled ? '禁用' : '可用'"></Tag>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="用户详情" :modal="true" class="p-fluid">
                    <div class="field flex justify-content-center">
                        <Avatar :image="'http://localhost:8080/redMs_war/static/images/' + product.avatar" class="mr-2" size="xlarge" shape="circle" />
                    </div>
                    <div class="flex justify-content-center">
                        <FileUpload mode="basic" name="" url="" accept="image/*" customUpload @uploader="customBase64Uploader" />
                    </div>
                    <div class="field">
                        <label for="username">用户名</label>
                        <InputText id="username" v-model.trim="product.username" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.username">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="nickname">昵称</label>
                        <InputText id="nickname" v-model.trim="product.nickname" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.nickname">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">性别</label>
                        <Dropdown id="inventoryStatus" v-model="product.gender" :options="statuses" optionLabel="label" placeholder="选择性别">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="field">
                        <label for="email">邮箱</label>
                        <InputText id="email" v-model.trim="product.email" required="true" autofocus :class="{ 'p-invalid': submitted && !product.email }" />
                    </div>
                    <div class="field">
                        <label class="mb-3">生日</label>
                        <Calendar v-model="product.birthday" dateFormat="yy-mm-dd" />
                    </div>
                    <div class="field">
                        <label for="password" class="mb-3">密码</label>
                        <Password v-model="product.password" toggleMask inputId="password" />
                    </div>

                    <div class="field">
                        <label class="mb-3">是否禁用</label>
                        <SelectButton v-model="product.isDisabled" :options="option" optionLabel="name" aria-labelledby="basic" />
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addProductDialog" :style="{ width: '450px' }" header="新增用户" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="avatar">头像</label>
                      <div class="field flex justify-content-center">
                        <Avatar :image="'http://localhost:8080/redMs_war/static/images/' + product.avatar" class="mr-2" size="xlarge" shape="circle" />
                      </div>
                        <div class="flex justify-content-center">
                            <FileUpload mode="basic" name="" url="" accept="image/*" customUpload @uploader="customBase64Uploader" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="username">用户名</label>
                        <InputText id="username" v-model.trim="product.username" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.username">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="nickname">昵称</label>
                        <InputText id="nickname" v-model.trim="product.nickname" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.nickname">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">性别</label>
                        <Dropdown id="inventoryStatus" v-model="product.gender" :options="statuses" optionLabel="label" placeholder="选择性别">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <label for="email">邮箱</label>
                        <InputText id="email" v-model.trim="product.email" required="true" autofocus :class="{ 'p-invalid': submitted && !product.email }" />
                    </div>

                    <div class="field">
                        <label class="mb-3">生日</label>
                        <Calendar v-model="product.birthday" dateFormat="yy-mm-dd" />
                    </div>
                    <div class="field">
                        <label for="password" class="mb-3">密码</label>
                        <Password v-model="product.password" toggleMask inputId="password" />
                    </div>

                    <div class="field">
                        <label class="mb-3">是否禁用</label>
                        <SelectButton v-model="product.isDisabled" :options="option" optionLabel="name" aria-labelledby="basic" />
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideAddDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveAddProduct" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="确认删除" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">您确定要删除这些用户信息吗？</span>
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

<style scoped></style>
