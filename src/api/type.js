import request from "@/utils/request";

export const getTypeList = () =>{
  return request.get('/type/selectAllTypes');
}
