<template>
  <div>
    <h1>{{ state.title }}</h1>
    <div class="middle pt-5">
      <div :key="question.id" v-for="question in state.questions">
        <component
          :is="calcComponentType(question.content.type)"
          :schema="question.content"
          :sideEffect="state.sideEffect"
          v-model="question.answer"
          disabled
        />
        <v-chip color="green" text-color="white"
          >正确答案：{{ question.content.content.answer }}</v-chip
        >
        <v-btn
          color="red"
          style="color: white"
          class="ml-5"
          @click="deleteQues(question.id)"
          >删除</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";
import ListenSelect from "../../components/question/ListenSelect.vue";
import ListenDetermine from "../../components/question/ListenDetermine";
import OralWithText from "../../components/question/OralWithText";
import OralWithAudio from "../../components/question/OralWithAudio";
import { QuestionComponentType } from "../../constants/question";

export default defineComponent({
  components: {
    ListenSelect,
    ListenDetermine,
    OralWithText,
    OralWithAudio,
  },
  setup(props, { root }) {
    const state = reactive({
      questions: [],
      title: "",
      id: root.$route.query.id,
      sideEffect: {
        editing: false,
      },
      answer: {},
      rank: {},
    });

    function calcComponentType(input = "") {
      return QuestionComponentType[input.toUpperCase()];
    }

    async function initPaper() {
      let { data } = await api.get(`/student/question_collect`);
      data = data.map((item) => ({
        ...item,
        content: JSON.parse(item.content),
      }));
      console.log(data);
      state.questions = data;
    }

    initPaper();

    async function deleteQues(id) {
      await api.delete(`/student/question_collect?id=${id}`);
      initPaper();
    }

    return {
      state,
      calcComponentType,
      deleteQues,
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.push("/paperlist");
    },
  },
  data() {
    return {
      sideEffect: {
        editing: false,
      },
    };
  },
});
</script>

<style scoped>
.page-container {
  min-height: 100px;
  display: flex;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
