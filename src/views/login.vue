<template>
  <div class="login">
    <div id="particles-js"></div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">智能体应用中心</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'"
            >立即注册</router-link
          >
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2024 insistence.tech All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import "particles.js";
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  mounted() {
    this.initParticles();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        this.register =
          res.registerEnabled === undefined ? false : res.registerEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
        }
      });
    },
    initParticles() {
      particlesJS("particles-js", {
        particles: {
          number: {
            // 粒子的数量设置
            value: 80, // 粒子的总数量
            density: {
              // 粒子密度设置
              enable: true, // 是否启用密度计算
              value_area: 800, // 密度计算的区域（像素）
            },
          },
          color: {
            // 粒子的颜色设置
            value: "#0EBFD6", // 粒子的颜色（白色）
          },
          shape: {
            // 粒子的形状设置
            type: "circle", // 粒子的形状类型（圆形）
            stroke: {
              // 粒子的边框设置
              width: 0, // 边框的宽度
              color: "#000000", // 边框的颜色（黑色）
            },
            polygon: {
              // 多边形形状的设置
              nb_sides: 5, // 多边形的边数
            },
          },
          opacity: {
            // 粒子的透明度设置
            value: 0.2, // 初始透明度
            random: false, // 是否启用随机透明度
            anim: {
              // 透明度动画设置
              enable: false, // 是否启用透明度动画
              speed: 1, // 透明度动画的速度
              opacity_min: 0.1, // 最小透明度
              sync: false, // 是否同步所有粒子的透明度变化
            },
          },
          size: {
            // 粒子的大小设置
            value: 3, // 初始大小
            random: true, // 是否启用随机大小
            anim: {
              // 大小动画设置
              enable: false, // 是否启用大小动画
              speed: 50, // 大小动画的速度
              size_min: 0.1, // 最小大小
              sync: false, // 是否同步所有粒子的大小变化
            },
          },
          line_linked: {
            // 粒子之间连线的设置
            enable: true, // 是否启用粒子之间的连线
            distance: 150, // 连线的最大距离
            color: "#1890FF", // 连线的颜色（白色）
            opacity: 0.3, // 连线的透明度
            width: 1, // 连线的宽度
          },
          move: {
            // 粒子的移动行为设置
            enable: true, // 是否启用移动
            speed: 6, // 粒子的移动速度
            direction: "none", // 移动的方向（无特定方向）
            random: false, // 是否启用随机方向
            straight: false, // 是否启用直线移动
            out_mode: "out", // 粒子离开视图时的处理方式（离开时不再出现）
            attract: {
              // 粒子的吸引效果设置
              enable: false, // 是否启用吸引效果
              rotateX: 600, // X轴方向的旋转吸引力度
              rotateY: 1200, // Y轴方向的旋转吸引力度
            },
          },
        },
        interactivity: {
          // 粒子与用户的交互设置
          detect_on: "canvas", // 检测交互的区域（画布）
          events: {
            onhover: {
              // 鼠标悬停事件设置
              enable: true, // 是否启用鼠标悬停交互
              mode: "grab", // 悬停时的效果（抓取效果）
            },
            onclick: {
              // 鼠标点击事件设置
              enable: true, // 是否启用鼠标点击交互
              mode: "push", // 点击时的效果（推送粒子）
            },
            resize: true, // 是否启用在窗口大小变化时的粒子调整
          },
          modes: {
            grab: {
              // 悬停时的抓取效果设置
              distance: 140, // 抓取效果的距离
              line_linked: {
                // 抓取效果连线的设置
                opacity: 1, // 连线的透明度
              },
            },
            bubble: {
              // 鼠标悬停时的气泡效果设置
              distance: 400, // 气泡效果的距离
              size: 40, // 气泡的大小
              duration: 2, // 气泡效果的持续时间
              opacity: 8, // 气泡效果的透明度
              speed: 3, // 气泡效果的速度
            },
            repulse: {
              // 鼠标悬停时的排斥效果设置
              distance: 200, // 排斥效果的距离
              duration: 0.4, // 排斥效果的持续时间
            },
            push: {
              // 点击时的推送效果设置
              particles_nb: 4, // 推送效果中增加的粒子数量
            },
            remove: {
              // 点击时的移除效果设置
              particles_nb: 2, // 移除效果中移除的粒子数量
            },
          },
        },
        retina_detect: true, // 启用视网膜屏幕检测，以确保高分辨率显示器上的粒子效果清晰
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-image: url("../assets/images/login-background.jpg");
  background: #d9f2f5;
  background-size: cover;
  position: relative;
}
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
  line-height: 1.5;
  letter-spacing: 5px;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  z-index: 2;
  // 透明
  opacity: 0.8;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
