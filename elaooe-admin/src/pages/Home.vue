<template>
  <div>
    <h1 class="mt-5 ml-5" @click="ping">英语考试系统-管理员端</h1>
    <div class="con">
      <v-calendar class="calen ma-5" ref="calendar"></v-calendar>
      <div class="calen">
        <v-card class="ma-5" color="#26c6da" dark max-width="400">
          <v-card-title>
            <v-icon large left> mdi-avatar </v-icon>
            <span class="title font-weight-light">个人信息</span>
          </v-card-title>
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title
                >昵称-{{ state.userinfo.nickName }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="grow">
            <v-list-item-title
              >用户名-{{ state.userinfo.userName }}</v-list-item-title
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
            <v-text-field
              v-model="state.userinfo.nickName"
              label="昵称"
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
import { api } from "../api";
import { downloadApiBase } from "../api/config";
import AvatarUploader from "../components/AvatarUploader.vue";

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
    });

    api.get("/admin/me").then((e) => {
      console.log("me", e.data);
      state.userinfo = e.data;
      state.avatar = `${downloadApiBase}${e.data.avatar}`;
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
      api.post("/admin/updateInfo", {
        nickName: state.userinfo.nickName,
      });
      hideDialog();
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
      const { data } = await api.post("/admin/updatePassword", {
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
