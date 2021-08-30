<template>
  <div>
    <v-row align="end" justify="end" class="mt-3 pr-5">
      <v-btn color="primary" depressed @click="createPaper">新建试卷</v-btn>
    </v-row>
    <v-simple-table class="mt-6">
      <thead>
        <tr>
          <th class="text-left">卷子ID</th>
          <th class="text-left">卷子名称</th>
          <th class="text-left">修改</th>
          <th class="text-left">删除</th>
          <th class="text-left">发卷</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in state.papers" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td><v-btn @click="edit(item.id)">修改</v-btn></td>
          <td><v-btn color="red">删除</v-btn></td>
          <td><v-btn color="blue" @click="sendPaper(item.id)">发卷</v-btn></td>
        </tr>
      </tbody>
    </v-simple-table>

    <!--发卷 Dialog-->
    <v-dialog
      v-model="state.sendPaperDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="hideSendPaperDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <v-toolbar-title>发卷子</v-toolbar-title>
          <v-spacer />
          <v-btn dark text @click="actuallySend"
            ><v-icon>mdi-send-outline</v-icon></v-btn
          >
        </v-toolbar>
        <v-text-field
          v-model="state.search"
          class="ma-5"
          append-icon="mdi-magnify"
          label="搜索"
          single-line
          hide-details=""
        ></v-text-field>
        <v-data-table
          v-model="state.selectedStudents"
          :headers="state.headers"
          :items="state.students"
          :search="state.search"
          item-key="id"
          show-select
          class="elevation-1"
        >
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";

export default defineComponent({
  setup() {
    const state = reactive({
      papers: [],
      sendPaperDialog: false,
      selectedStudents: [],
      headers: [
        {
          text: "用户名",
          align: "start",
          sortable: true,
          value: "userName",
        },
        {
          text: "昵称",
          align: "start",
          sortable: true,
          value: "nickName",
        },
      ],
      students: [],
      search: "",
      curPaperTemplateId: null,
    });

    async function refresh() {
      const ret = await api.get("/mentor/papertemplates");
      state.papers = ret.data;
      const { data: students } = await api.get("/mentor/student");
      state.students = students;
      console.log("papers", state.papers);
    }
    refresh();

    function sendPaper(id) {
      console.log("发卷啦", id);
      state.sendPaperDialog = true;
      state.curPaperTemplateId = id;
    }

    function hideSendPaperDialog() {
      state.sendPaperDialog = false;
    }

    function actuallySend() {
      const templateId = state.curPaperTemplateId;
      const ids = state.selectedStudents.map((item) => item.id);
      api.post("/mentor/send_paper", {
        paperTemplateId: templateId,
        studentIds: ids,
      });
    }

    return {
      state,
      sendPaper,
      hideSendPaperDialog,
      actuallySend,
    };
  },
  methods: {
    createPaper() {
      this.$router.push({ path: "/paperdetail", query: { type: "new" } });
    },
    edit(id) {
      this.$router.push({ path: "/paperdetail", query: { type: "edit", id } });
    },
  },
});
</script>
