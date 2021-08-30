<template>
  <div>
    <v-dialog
      v-model="state.importDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="hideImportXlsx">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>批量导入</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-textarea v-model="state.importContent"></v-textarea>
          <v-row justify="end">
            <v-btn color="primary" @click="importContent">导入</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-row align="center" justify="end" class="mt-3 pr-5">
      <v-col cols="4"
        ><v-text-field
          v-model="state.searchName"
          label="搜索用户名"
        ></v-text-field
      ></v-col>
      <v-btn color="primary" @click="genXlsx">导出表格</v-btn>
      <v-col cols="1" class="mr-5">
        <v-dialog
          v-model="state.createDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" depressed v-on="on" v-bind="attrs"
              >新建用户</v-btn
            >
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn dark text @click="hideCreateDialog"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <v-toolbar-title>教师信息</v-toolbar-title>
            </v-toolbar>
            <div class="pa-5">
              <v-form>
                <v-text-field
                  v-model="state.newStudent.userName"
                  :counter="10"
                  label="用户名"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="state.newStudent.passWord"
                  label="密码"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="state.newStudent.nickName"
                  label="昵称"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="state.newStudent.code"
                  label=" 工号"
                  required
                ></v-text-field>
                <v-radio-group
                  label="性别"
                  v-model="state.newStudent.gender"
                  row
                >
                  <v-radio label="男" value="MALE"></v-radio>
                  <v-radio label="女" value="FEMALE"></v-radio>
                </v-radio-group>
                <v-text-field
                  v-model="state.newStudent.phone"
                  label="电话"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="state.newStudent.email"
                  label="电子邮箱"
                  required
                ></v-text-field>
                <v-switch
                  label="是否可以登陆"
                  v-model="state.newStudent.canLogin"
                ></v-switch>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="submit"
                >
                  {{ valid ? "保存" : "请填完整表单" }}
                </v-btn>
              </v-form>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-simple-table class="mt-6">
      <thead>
        <tr>
          <th class="text-left">用户名</th>
          <th class="text-left">密码</th>
          <th class="text-left">昵称</th>
          <th class="text-left">工号</th>
          <th class="text-left">性别</th>
          <th class="text-left">电话</th>
          <th class="text-left">邮箱</th>
          <th class="text-left">能否登陆</th>
          <th class="text-left">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filterStudents" :key="item.id">
          <td>{{ item.userName }}</td>
          <td>{{ item.passWord }}</td>
          <td>{{ item.nickName }}</td>
          <td>
            {{ item.code }}
          </td>
          <td>{{ item.gender }}</td>
          <td>{{ item.phone }}</td>
          <td>{{ item.email }}</td>
          <td>
            <v-switch
              v-model="item.canLogin"
              @click="changeCanLogin(item.id, item.canLogin)"
            ></v-switch>
          </td>
          <td>
            <v-btn class="mr-3" @click="edit(item.id)">修改</v-btn>
            <v-btn @click="deleteStudent(item.id)">删除</v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { computed, defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";
import { downloadApiBase } from "../../api/config";
import AvatarUploader from "../../components/AvatarUploader.vue";

const emptyStudent = {
  userName: "",
  passWord: "",
  nickName: "",
  code: "",
  gender: "",
  phone: "",
  email: "",
  canLogin: true,
};

export default defineComponent({
  components: {
    AvatarUploader,
  },
  setup() {
    const state = reactive({
      students: [],
      searchName: "",
      createDialog: false,
      newStudent: Object.assign({}, emptyStudent),
      downloadApiBase: downloadApiBase,
      editingId: null,
      importDialog: false,
      importContent: "",
    });

    const hideCreateDialog = () => {
      state.createDialog = false;
      state.newStudent = Object.assign({}, emptyStudent);
      state.editingId = null;
    };

    const edit = (id) => {
      const curStudent = state.students.find((item) => item.id === id);
      const editStudent = Object.assign({}, curStudent);
      state.editingId = editStudent.id;
      delete editStudent.id;
      state.newStudent = editStudent;
      state.createDialog = true;
    };

    const filterStudents = computed(() => {
      if (state.searchName) {
        return state.students.filter(
          (item) => item.userName.indexOf(state.searchName) > -1
        );
      } else {
        return state.students;
      }
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

    async function submit() {
      if (state.editingId) {
        api.post(
          "/admin/mentor",
          Object.assign({ id: state.editingId }, state.newStudent)
        );
      } else {
        api.post("/admin/mentor", Object.assign({}, state.newStudent));
      }
      hideCreateDialog();
      refresh();
    }

    async function genXlsx() {
      const output = state.students.reduce((acc, cur) => {
        return acc + `${cur.nickName},${cur.userName},${cur.passWord}\n`;
      }, "data:text/csv;charset=utf-8,昵称,用户名,密码\n");
      console.log(output);
      var encodedUri = encodeURI(output);
      window.open(encodedUri);
    }

    async function importXlsx() {
      state.importDialog = true;
    }

    async function hideImportXlsx() {
      state.importDialog = false;
      state.importContent = "";
    }

    async function deleteStudent(id) {
      await api.delete(`/admin/mentor?id=${id}`);
      refresh();
    }

    async function refresh() {
      const ret = await api.get("/admin/mentor");
      console.log("data", ret.data);
      state.students = ret.data;
    }

    async function importContent() {
      const rows = state.importContent
        .split("\n")
        .map((item) => item.split(","))
        .map((arr) => ({
          userName: arr[0],
          passWord: arr[1],
          nickName: arr[2],
          gender: arr[3],
          phone: arr[4],
          email: arr[5],
          canLogin: true,
        }));

      for (const student of rows) {
        await api.post("/admin/mentor", student);
      }
      hideImportXlsx();

      refresh();
    }

    refresh();
    return {
      state,
      filterStudents,
      hideCreateDialog,
      valid,
      submit,
      edit,
      deleteStudent,
      genXlsx,
      importXlsx,
      hideImportXlsx,
      importContent,
    };
  },
  methods: {
    createPaper() {
      this.$router.push({ path: "/paperdetail", query: { type: "new" } });
    },
    changeCanLogin(id, value) {
      console.log("can login", id, value);
      // Sync
      api.post("/admin/mentor", { id, canLogin: value });
    },
  },
});
</script>
