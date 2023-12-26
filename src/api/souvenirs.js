import request from '@/utils/request';
import { adminStore } from '@/stores';

export const selectAllSouvenirs = () => {
    return request.get('/api/souvenirs/selectAll', {
        headers: {
            Authorization: adminStore().token.tokenStr
        }
    });
};

export const selectAllSouvenirsByType = (id) => {
  return request.post('/api/souvenirs/selectAllByType', id,{
    headers: {
      Authorization: adminStore().token.tokenStr
    }
  });
};

export const addSouvenirs = (souvenirs) => {
    return request.post('/api/souvenirs/addSouvenirs',
        {
            ...souvenirs
        },
        {
            headers: {
                Authorization: adminStore().token.tokenStr
            }
        }
    );
};

export const removeSouvenirs = (arr) => {
    return request.post(
        '/api/souvenirs/delete',
            arr,
        {
            headers: {
                Authorization: adminStore().token.tokenStr
            }
        }
    )
}

export const modifySouvenirs = (souvenirs) => {
    return request.post(
      '/api/souvenirs/update',
      {
          ...souvenirs
      },
      {
          headers: {
              Authorization: adminStore().token.tokenStr
          }
      }
    )
}
