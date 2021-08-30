<template>
  <div>
    <h1>{{ state.title }}</h1>
    <div class="middle pt-5">
      <div :key="question.id" v-for="(question, index) in state.questions">
        <v-chip color="green" text-color="white">第{{ index + 1 }}题</v-chip>
        <v-chip
          v-if="state.rank[question.id] > -1"
          class="ml-5"
          color="blue"
          text-color="white"
          >{{ state.rank[question.id] }} 分</v-chip
        >
        <v-chip v-else class="ml-5" color="red" text-color="white"
          >未批阅</v-chip
        >
        <v-btn class="ml-5" @click="star(question)">添加到收藏</v-btn>
        <component
          :is="calcComponentType(question.type)"
          :schema="question"
          :sideEffect="state.sideEffect"
          v-model="state.answer[question.id]"
          disabled
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  reactive,
  watch,
} from "@vue/composition-api";
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
      const { data } = await api.get(`/student/paper?id=${state.id}`);
      const questionTemplate = data.paperTemplate;
      state.title = questionTemplate.name;
      state.questions = JSON.parse(questionTemplate.detail);
      state.answer = JSON.parse(data.answer);
      state.rank = JSON.parse(data.rank);
      console.log("answer", state.answer);
      console.log(state.questions);
    }

    const canSubmit = computed(() => {
      for (let key in state.answer) {
        if (!state.answer[key]) {
          return false;
        }
      }
      return true;
    });

    initPaper();

    watch(state, () => {
      console.log(state.answer);
    });

    function submit() {
      api
        .post("/student/paper_submit", { id: state.id, answer: state.answer })
        .then((e) => {
          console.log(e);
        });
    }

    function star(question) {
      console.log(
        "question",
        JSON.stringify(
          { question: question, answer: state.answer[question.id] },
          null,
          2
        )
      );
      const body = {
        paperName: state.title,
        content: JSON.stringify(question),
        answer: state.answer[question.id],
        questionId: question.id,
      };
      api.post("/student/question_collect", body);
    }

    return {
      state,
      calcComponentType,
      canSubmit,
      submit,
      star,
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
