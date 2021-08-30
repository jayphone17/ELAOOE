<template>
  <div>
    <apexchart
      width="100%"
      height="300px"
      type="bar"
      :options="state.options"
      :series="state.options.series"
    ></apexchart>
    <v-simple-table class="mt-6">
      <thead>
        <tr>
          <th class="text-left">卷子ID</th>
          <th class="text-left">学生名称</th>
          <th class="text-left">用户名</th>
          <th class="text-left">是否批阅</th>
          <th class="text-left">分数/总分数</th>
          <th class="text-left">正确数/总数</th>
          <th class="text-left">阅卷</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in state.papers" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.student.nickName }}</td>
          <td>{{ item.student.userName }}</td>
          <td>{{ item.judged ? "是" : "否" }}</td>
          <td>{{ item.score }}/{{ item.totalCount * 10 }}</td>
          <td>{{ item.rightCount }} / {{ item.totalCount }}</td>
          <td><v-btn color="blue" @click="checkPaper(item.id)">阅卷</v-btn></td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";

export default defineComponent({
  setup(props, context) {
    const state = reactive({
      papers: [],
      sendPaperDialog: false,
      selectedStudents: [],
      students: [],
      search: "",
      curPaperTemplateId: null,
      id: context.root.$route.query.id,
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
        series: [
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91],
          },
        ],
      },
    });

    async function refresh() {
      const ret = await api.get(`/mentor/papertemplate?id=${state.id}`);
      state.papers = ret.data.papers;

      console.log("papers", ret.data.papers);

      state.options = {
        ...state.options,
        xaxis: {
          categories: ret.data.papers.map((item) => item.student.userName),
        },
        series: [
          {
            name: "series-1",
            data: ret.data.papers.map((item) => item.score),
          },
        ],
      };

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
    checkPaper(id) {
      this.$router.push({ path: "/user_paper_detail", query: { id } });
    },
    edit(id) {
      this.$router.push({ path: "/paperdetail", query: { type: "edit", id } });
    },
  },
});
</script>
