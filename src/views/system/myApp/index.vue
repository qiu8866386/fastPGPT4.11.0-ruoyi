<template>
  <div>
    <div v-loading="loading" class="iframe-container">
      <i-frame :src="url" />
    </div>
  </div>
</template>
<script>
import iFrame from "@/components/iFrame/index";
// import { toFastGpt } from "@/api/chat/fastgpt"; // 请确保你导入了正确的 request 工具
export default {
  name: "repositorys",
  components: { iFrame },
  data() {
    return {
      url: "", // 初始状态为空字符串
      loading: false, // 遮罩层
    };
  },
  created() {
    this.loading = true; // 开始加载时，显示遮罩层
    this.url = "http://192.168.10.171:3000";
    // toFastGpt()
    //   .then((res) => {
    //     this.url = res.url; // 请求成功后更新 url
    //   })
    //   .finally(() => {
    //     setTimeout(() => {
    //       this.loading = false; // 延迟 1 秒隐藏遮罩层
    //     }, 1000);
    //     // this.loading = false; // 请求完成后，无论成功与否，都隐藏遮罩层
    //   });
  },
};
</script>

<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  /* 你可以根据需要调整 iframe 容器的大小 */
}
</style>
