import request from '@/utils/request';
import { adminStore } from '@/stores';

export const userLogin = (username,password) => {
  return request.post('/userLogin/login',{
    username,
    password
  }
  );
}
export const selectAllUsers = () => {
    return request.get('/api/userInfo/selectAll', {
        headers: {
            Authorization: adminStore().token.tokenStr
        }
    });
};

export const modifyUser = (user) => {
    return request.post(
        '/api/userInfo/updateUser',
        {
          ...user
        },
        {
            headers: {
                Authorization: adminStore().token.tokenStr
            }
        }
    );
};

export const addUser = (user) => {
  return request.post('/api/userInfo/addUser',
    {
      ...user
    },
    {
      headers: {
        Authorization: adminStore().token.tokenStr
      }
    })
}

export const removeUser = (arr) => {
  return request.post( '/api/userInfo/deleteAll',
    arr,
    {
      headers: {
        Authorization: adminStore().token.tokenStr
      }
    })
}
