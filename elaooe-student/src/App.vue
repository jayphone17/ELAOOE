<template>
  <v-app id="inspire">
    <v-snackbar v-model="snackBar">{{ snackMessage }}</v-snackbar>
    <v-app-bar app color="#ffffff" flat>
      <v-tabs
        id="tabs"
        @change="tabChange"
        :value="curTabIndex"
        v-if="linkShow"
        centered
        color="#346758"
      >
        <v-tab v-for="link in links" :key="link" @click="go(link)">
          {{ link }}
        </v-tab>
      </v-tabs>
      <v-spacer />
      <v-btn v-if="logo" outlined class="mr-5" @click="logout">登出</v-btn>
      <v-avatar color="indigo">
        <img :src="avatar" alt="" />
      </v-avatar>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <transition>
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import { api } from "./api";
import { downloadApiBase } from "./api/config";

const linkMap = {
  首页: "/home",
  我的试卷: "/paperlist",
  收藏: "/star",
  成绩统计: "/score",
  留言板: "/comment",
  麦克风测试: "/mictest",
  公告: "/notice",
};

const indexMap = {
  "#/home": 0,
  "#/paperlist": 1,
  "#/notice": 2,
  "#/star": 3,
  "#/score": 4,
  "#/comment": 5,
  "#/mictest": 6,
};

export default {
  name: "App",

  data: () => ({
    links: [
      "首页",
      "我的试卷",
      "公告",
      "收藏",
      "成绩统计",
      "留言板",
      "麦克风测试",
    ],
    linkShow: true,
    tabClass: "tab-show",
    curTabIndex: indexMap[location.hash] ?? 0,
    avatar: "",
    snackMessage: "",
    snackBar: false,
  }),

  computed: {
    logo() {
      console.log("route", this.$route.path);
      return this.$route.path !== "/login";
    },
  },

  mounted() {
    if (this.$route.path === "/login") {
      this.linkShow = false;
      this.tabClass = "tab-hide";
    } else {
      this.linkShow = true;
      this.tabClass = "tab-show";
    }

    api.get("/student/me").then((e) => {
      console.log("me", e.data);
      this.avatar = `${downloadApiBase}${e.data.avatar}`;
    });

    this.$bus.$on("info", () => {
      api.get("/student/me").then((e) => {
        console.log("me", e.data);
        this.avatar = `${downloadApiBase}${e.data.avatar}`;
      });
    });

    this.$bus.$on("toast", (e) => {
      this.snackBar = true;
      this.snackMessage = e;
    });
  },

  methods: {
    go(e) {
      this.$router.push(linkMap[e]);
    },
    tabChange(e) {
      this.curTabIndex = e;
    },
    logout() {
      localStorage.setItem("token", "");
      this.$router.push("/login");
    },
  },

  watch: {
    $route(to) {
      if (to.path === "/login") {
        this.linkShow = false;
        this.tabClass = "tab-hide";
      } else {
        this.linkShow = true;
        this.tabClass = "tab-show";
      }
    },
  },
};
</script>

<style>
.test {
  color: pink;
}
.tab-show {
  opacity: 1;
  transition: all 0.5s;
}
.tab-hide {
  opacity: 0;
  transition: all 0.5s;
}
#inspire {
  min-width: 1000px;
}
</style>
