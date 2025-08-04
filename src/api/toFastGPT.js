import request from "@/utils/request";

// 获取路由
export const getLinks = (params) => {
  return request({
    url: "/api/links",
    method: "get",
    params,
  });
};
