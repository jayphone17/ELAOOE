<template>
  <div>
    <h1 class="mt-5 ml-5" @click="ping">欢迎使用英语考试系统</h1>
    <div class="con">
      <div class="calen ma-5">
        <v-calendar ref="calendar"></v-calendar>
      </div>
      <div class="calen">
        <v-carousel v-model="state.idx" style="height: 300px">
          <v-carousel-item v-for="(color, i) in state.carosels" :key="i">
            <img :src="genImgUrl(color.imgSrc)" height="300px" />
          </v-carousel-item>
        </v-carousel>
        <v-card class="ma-5" color="#26c6da" dark max-width="400">
          <v-card-title>
            <v-icon large left> mdi-avatar </v-icon>
            <span class="title font-weight-light">个人信息</span>
          </v-card-title>
          <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
              <v-img class="elevation-6" alt="" :src="state.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{
                state.userinfo.nickName
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="grow">
            <v-list-item-title
              >用户名{{ state.userinfo.userName }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item class="grow">
            <v-list-item-title
              >性别{{ state.userinfo.gender }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item class="grow">
            <v-list-item-title
              >手机号{{ state.userinfo.phone }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item class="grow">
            <v-list-item-title
              >电子邮箱{{ state.userinfo.email }}</v-list-item-title
            >
          </v-list-item>
          <v-btn class="ma-3" @click="state.editDialog = true">修改信息</v-btn>
          <v-btn class="ma-3" @click="state.passDialog = true">修改密码</v-btn>
        </v-card>
      </div>
    </div>

    <v-dialog
      v-model="state.editDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="hideDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <v-toolbar-title>修改信息</v-toolbar-title>
        </v-toolbar>
        <div class="pa-5">
          <v-form>
            <avatar-uploader v-model="state.userinfo.avatar" class="mb-5" />
            <v-text-field
              v-model="state.userinfo.nickName"
              label="昵称"
              required
            ></v-text-field>
            <v-radio-group label="性别" v-model="state.userinfo.gender" row>
              <v-radio label="男" value="MALE"></v-radio>
              <v-radio label="女" value="FEMALE"></v-radio>
            </v-radio-group>
            <v-text-field
              v-model="state.userinfo.phone"
              label="电话"
              required
            ></v-text-field>
            <v-text-field
              v-model="state.userinfo.email"
              label="电子邮箱"
              required
            ></v-text-field>
            <v-btn @click="updateInfo" color="success" class="mr-4">
              保存
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="state.passDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="hideDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <v-toolbar-title>修改密码</v-toolbar-title>
        </v-toolbar>
        <div class="pa-5">
          <v-form>
            <v-text-field
              label="原密码"
              type="password"
              v-model="state.oriPassword"
              required
            ></v-text-field>
            <v-text-field
              v-model="state.newPassword"
              label="新密码"
              type="password"
              required
            ></v-text-field
            ><v-text-field
              v-model="state.repeatNewPassword"
              label="重复密码"
              type="password"
              required
            ></v-text-field>
            <v-btn @click="updatePassword" color="success" class="mr-4">
              {{ valid ? "保存" : "请填完整表单" }}
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";
import { downloadApiBase } from "../../api/config";
import AvatarUploader from "../../components/AvatarUploader.vue";

export default defineComponent({
  components: { AvatarUploader },
  setup(props, context) {
    const state = reactive({
      userinfo: {},
      avatar: "",
      editDialog: false,
      passDialog: false,
      oriPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      idx: 0,
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      carosels: [],
    });

    api.get("/student/me").then((e) => {
      console.log("me", e.data);
      state.userinfo = e.data;
      state.avatar = `${downloadApiBase}${e.data.avatar}`;
    });

    api.get("/student/carousel").then((e) => {
      console.log("carousel", e.data);
      state.carosels = e.data;
    });

    const valid = computed(() => {
      for (let key in state.newStudent) {
        if (key === "canLogin") continue;
        if (!state.newStudent[key]) {
          return false;
        }
      }
      return true;
    });

    function hideDialog() {
      state.editDialog = false;
      state.passDialog = false;
      state.oriPassword = "";
      state.newPassword = "";
      state.repeatNewPassword = "";
    }

    function updateInfo() {
      api.post("/student/updateInfo", {
        nickName: state.userinfo.nickName,
        avatar: state.userinfo.avatar,
        gender: state.userinfo.gender,
        phone: state.userinfo.phone,
        email: state.userinfo.email,
      });
      hideDialog();
    }

    function genImgUrl(input) {
      return `${downloadApiBase}${input}`;
    }

    async function updatePassword() {
      if (
        !state.oriPassword ||
        !state.newPassword ||
        !state.repeatNewPassword
      ) {
        context.root.$bus.$emit("toast", "请输入密码");
        return;
      }
      const { data } = await api.post("/student/updatePassword", {
        oriPassword: state.oriPassword,
        newPassword: state.newPassword,
        repeatNewPassword: state.repeatNewPassword,
      });
      if (data) {
        hideDialog();
      } else {
        context.root.$bus.$emit("toast", "原密码输入错误");
      }
    }

    async function ping() {
      window.$bus.$emit("toast", "hello");
    }

    return {
      state,
      valid,
      hideDialog,
      updateInfo,
      updatePassword,
      ping,
      genImgUrl,
    };
  },
});
</script>

<style scoped>
.con {
  display: flex;
}

.calen {
  flex-grow: 1;
  width: 50%;
}
</style>
