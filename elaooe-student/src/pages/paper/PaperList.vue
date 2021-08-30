<template>
  <div>
    <v-simple-table class="mt-6">
      <thead>
        <tr>
          <th class="text-left">卷子ID</th>
          <th class="text-left">卷子名称</th>
          <th class="text-left">是否完成</th>
          <th class="text-left">分数</th>
          <th class="text-left">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in state.papers" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.paperTemplate.name }}</td>
          <td>
            <v-chip v-if="item.doneYet" color="green" text-color="white"
              >完成</v-chip
            >
            <v-chip v-else color="red" text-color="white">未完成</v-chip>
          </td>
          <td>
            <span v-if="item.judged">{{ item.score }}</span
            ><v-chip v-else color="blue" text-color="white">批阅中</v-chip>
          </td>
          <td>
            <v-btn
              v-if="!item.doneYet"
              color="red"
              style="color: white"
              @click="goExam(item.id)"
              >进入考试</v-btn
            >
            <v-btn
              v-else
              color="green"
              style="color: white"
              @click="showPaper(item.id)"
            >
              查看试卷</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-simple-table>
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
      students: [],
      search: "",
      curPaperTemplateId: null,
    });

    async function refresh() {
      const ret = await api.get("/student/papers");
      state.papers = ret.data;
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
    goExam(id) {
      this.$router.push({ path: "/paperdetail", query: { id } });
    },
    showPaper(id) {
      this.$router.push({ path: "/papershow", query: { id } });
    },
  },
});
</script>
