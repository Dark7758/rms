
import request from "@/utils/request";

export const getAllCarts = (userId) => {
  return request.post('/cart/selectAllByUserId', userId )
}
export const removeCartItem = (userId,souvenirsId) =>{
  return request.post('/cart/removeItem', {
    userId,
    souvenirsId
  } )
}

export const updateCartItemQuantity = (userId,souvenirsId,quantity) =>{
  return request.post('/cart/updateQuantity',
    {
      userId,
      souvenirsId,
      quantity
    }
  )
}

export const addCartItem = (userId,souvenirsId,quantity) =>{
  return request.post('http://localhost:8080/redMs_war/cart/addCartItem',
    {
      userId,
      souvenirsId,
      quantity
    }
  )
}


