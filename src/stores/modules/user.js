import { defineStore } from 'pinia'
import { computed, ref } from "vue";

export const userStore = defineStore(
  'user',
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
    const user = ref({
      userId:'',
      username:'',
      nickname:'',
      gender:'',
      email:'',
      avatar:''
    })
    const setUserId = (newUserId) => {
      user.value.userId = newUserId
    }
    const setUserAvatar = (newAvatar) => {
      user.value.avatar = newAvatar
    }
    const setUserUsername = (Username) => {
      user.value.username = Username
    }
    const setUserNickname = (Nickname) => {
      user.value.nickname = Nickname
    }
    const setUserGender = (Gender) => {
      user.value.gender = Gender
    }
    const setUserEmail = (Email) => {
      user.value.email = Email
    }

    const setUser  = (newUser) => {
      user.value = newUser
    }
    const userLogout = () => {
      user.value = null
      removeToken()
      localStorage.removeItem('user')
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      tokenEndTime,
      setUserAvatar,
      setUserUsername,
      setUserNickname,
      setUserGender,
      setUserEmail,
      userLogout,
      setUser
    }
  },
  {
    persist: true
  }
)
