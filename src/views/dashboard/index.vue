<template>
  <div class="app-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="open" class="card-container">
      <div
        class="box"
        v-for="link in links"
        :key="link.id"
        @click="navigateToLink(link.url)"
        :style="{
          width: sidebarOpened ? 'calc(33vw - 100px)' : 'calc(33vw - 55px)',
        }"
      >
        <div class="box-header">
          <!-- 为图片添加默认值 -->
          <img class="box-icon" :src="link.App_avatar || defaultIcon" alt="" />
          <div class="box-title">{{ link.App_name }}</div>
        </div>

        <div class="box-description">
          {{ link.App_intro || "暂无介绍" }}
        </div>

        <div class="box-footer">
          <div class="box-footer-left">
            {{ link.Creator_name }}
          </div>
          <div class="box-footer-right">
            {{ link.App_updateTime.split("T")[0] }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="fastGPT">
      <!-- <el-row class="button-row"> -->
      <!-- <el-button @click="aa" type="primary" class="back-btn">
          返回团队应用
        </el-button> -->
      <!-- </el-row> -->
      <iframe
        :src="currentUrl"
        class="iframe"
        frameborder="0"
        allow="microphone *; *"
      />
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import { getLinks } from "@/api/toFastGPT";

export default {
  data() {
    return {
      links: [],
      loading: false,
      error: null,
      open: true,
      currentUrl: null,
      defaultIcon: require("@/assets/svg/workflowFill.svg"),
      deptId: null,
    };
  },
  // 添加路由名称计算属性，用于判断是否为首页
  computed: {
    isDashboard() {
      return (
        this.$route.name === "Dashboard" || this.$route.path === "/dashboard"
      );
    },
    sidebarOpened() {
      return this.$store.state.app.sidebar.opened;
    },
  },

  mounted() {
    this.deptId = this.$store.state.user.dept.deptId;
    console.log("deptId", this.deptId);
    this.fetchLinks();
    //
  },
  watch: {
    "$store.state.app.sidebar.opened"(newVal) {
      console.log("侧边栏状态变了：", newVal);
      // 可以触发一些 UI 变化逻辑
    },
  },
  methods: {
    fetchLinks() {
      this.loading = true;
      this.error = null;
      const params = {
        team_name: this.deptId,
      };
      getLinks(params).then((response) => {
        this.links = response;
        this.loading = false;
        if (this.links.length == 0) {
          this.error = "暂无数据";
        }
      });
    },
    navigateToLink(url) {
      this.currentUrl = url;
      this.open = false;
    },
    // aa() {
    //   this.open = true;
    // },
  },
};
</script>
<style scoped lang="less">
.app-container {
  height: calc(100vh - 30px);
  width: 100%;
  padding: 0 0px;
  background: #f4f4f7;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .loading,
  .error {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #666;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: flex-start;
  }

  .fastGPT {
    width: 100%;
    height: calc(100% - 55px);
    // border-radius: 10px;
    .button-row {
      display: flex;
      justify-content: flex-end;
    }

    .back-btn {
      margin: 5px 0;
    }

    .iframe {
      width: 100%;
      height: 100%;
      // border-radius: 15px;
    }
  }
}

.box {
  padding: 10px;
  margin: 10px;
  width: calc(33vw - 100px);
  margin-left: 20px;
  min-width: 200px;
  height: 150px;
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #f3ecec;
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  transition: width 0.3s ease;
  overflow: hidden;

  .box-header {
    height: 20%;
    display: flex;
    align-items: center;
    padding: 5px 10px;

    .box-icon {
      width: 25px;
    }

    .box-title {
      margin-left: 10px;
      font-weight: bold;
      flex: 1;
    }
  }

  .box-description {
    height: 60%;
    padding: 10px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-word;
    font-size: 12.8px;
    line-height: 1.7em;
    max-height: calc(1.5em * 4);
    color: #667085;
  }

  .box-footer {
    height: 20%;
    text-align: right;
    padding-right: 10px;
    line-height: 200%;
    font-size: 12px;
    color: #888;
    display: flex;
    .box-footer-left {
      width: 50%;
      height: 100%;
      text-align: left;
    }
    .box-footer-right {
      width: 50%;
      height: 100%;
      text-align: right;
    }
  }
}
</style>
