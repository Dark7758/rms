import { defineStore } from 'pinia'
import { computed, ref } from "vue";

export const adminStore = defineStore(
  'admin',
  () => {
    const token = ref({})
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    // token过期时间
    const tokenEndTime = computed(()=>{
      return new Date(token.value.expiresAt)
    })
    const admin = ref({
      username:'',
      nickname:'',
      gender:'',
      email:'',
      avatar:''
    })

    const setAdminAvatar = (newAvatar) => {
      admin.value.avatar = newAvatar
    }
    const setAdminUsername = (Username) => {
      admin.value.username = Username
    }
    const setAdminNickname = (Nickname) => {
      admin.value.nickname = Nickname
    }
    const setAdminGender = (Gender) => {
      admin.value.gender = Gender
    }
    const setAdminEmail = (Email) => {
      admin.value.email = Email
    }

    const setAdmin  = (newAdmin) => {
      admin.value = newAdmin
    }
    const adminLogout = () => {
      admin.value = null
      removeToken()
      localStorage.removeItem('admin')
    }
    return {
      token,
      setToken,
      removeToken,
      admin,
      tokenEndTime,
      setAdminAvatar,
      setAdminUsername,
      setAdminNickname,
      setAdminGender,
      setAdminEmail,
      adminLogout,
      setAdmin
    }
  },
  {
    persist: true
  }
)
