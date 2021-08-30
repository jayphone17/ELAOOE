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
    </v-app-bar>

    <v-main class="grey lighten-3">
      <transition>
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
const linkMap = {
  首页: "/home",
  学生管理: "/studentlist",
  公告管理: "/notice",
  试卷管理: "/paperlist",
  题库管理: "/questionlist",
  阅卷: "/check_paper",
  留言管理: "/comment",
};

const indexMap = {
  "#/home": 0,
  "#/studentlist": 1,
  "#/notice": 2,
  "#/paperlist": 3,
  "#/questionlist": 4,
  "#/check_paper": 5,
  "#/comment": 6,
};

export default {
  name: "App",

  components: {},

  data: () => ({
    links: [
      "首页",
      "学生管理",
      "公告管理",
      "试卷管理",
      "题库管理",
      "阅卷",
      "留言管理",
    ],
    linkShow: true,
    tabClass: "tab-show",
    curTabIndex: indexMap[location.hash] ?? 0,
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
</style>
