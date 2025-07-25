import request from "@/utils/request";

// 获取路由
export const getLinks = () => {
  return request({
    url: "/api/links",
    method: "get",
  });
};
