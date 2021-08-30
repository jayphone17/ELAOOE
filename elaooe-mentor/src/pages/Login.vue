<template>
  <div class="wrapper">
    <v-card class="mx-auto" max-width="600" min-width="400">
      <v-card-text>
        <p class="display-1 text--primary">登录</p>
        <v-text-field
          v-model="userName"
          color="black"
          label="用户名"
        ></v-text-field>
        <v-text-field
          v-model="passWord"
          type="password"
          color="black"
          label="密码"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="deep-purple accent-4" @click="login">登录</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { api } from "../api";
export default {
  name: "Login",
  methods: {
    async login() {
      console.log(this.userName, this.passWord);
      const ret = await api.post("/mentor/login", {
        userName: this.userName,
        passWord: this.passWord,
      });
      console.log(ret);
      if (ret.code === 0) {
        this.logining = true;
        localStorage.setItem("token", ret.data);
        setTimeout(() => {
          this.$router.push("/home");
          this.$bus.$emit("info");
        }, 1000);
      } else {
        this.error = true;
      }
    },
    goHome() {
      this.$router.push("/");
    },
  },
  data() {
    return {
      userName: "",
      passWord: "",
      logining: false,
      error: false,
    };
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>