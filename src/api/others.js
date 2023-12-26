import request from "@/utils/request";

export const uploadImage = (formData) => {
  return request.post('/upload',formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
