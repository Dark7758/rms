import request from '@/utils/request';

/**
 * 管理员登录
 * @param username
 * @param password
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const login = (username, password) => {
  return request.post('/admin/login',{
    username,
    password
  })
}
