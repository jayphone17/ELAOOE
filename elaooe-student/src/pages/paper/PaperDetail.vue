<template>
  <div>
    <v-toolbar dense>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn
          :color="canSubmit ? 'green' : 'red'"
          :disabled="!canSubmit"
          style="color: white"
          @click="submit"
        >
          交卷
        </v-btn>
      </v-row>
    </v-toolbar>
    <div v-if="state.okShow" class="hover">
      <mic-test @ok="okHide"/>
    </div>
    <div class="middle pt-5">
      <div :key="question.id" v-for="(question, index) in state.questions">
        <v-chip color="green" text-color="white">第{{ index + 1 }}题</v-chip>
        <v-chip
          class="ml-5"
          color="blue"
          text-color="white"
          v-if="state.answer[question.id]"
          >已提交</v-chip
        >
        <v-chip class="ml-5" color="red" text-color="white" v-else
          >未提交</v-chip
        >
        <component
          :is="calcComponentType(question.type)"
          :schema="question"
          :sideEffect="state.sideEffect"
          v-model="state.answer[question.id]"
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
import MicTest from "../mictest/MicTest.vue";

export default defineComponent({
  components: {
    ListenSelect,
    ListenDetermine,
    OralWithText,
    OralWithAudio,
    MicTest,
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
      okShow: true,
    });

    function calcComponentType(input = "") {
      return QuestionComponentType[input.toUpperCase()];
    }

    async function initPaper() {
      const { data } = await api.get(`/student/paper?id=${state.id}`);
      const questionTemplate = data.paperTemplate;
      state.title = questionTemplate.name;
      state.questions = JSON.parse(questionTemplate.detail);
      const answer = state.questions.reduce((acc, cur) => {
        acc[cur.id] = "";
        return acc;
      }, {});
      state.answer = answer;
      console.log(state.answer);
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

    function okHide() {
      state.okShow = false;
    }

    initPaper();

    watch(state, () => {
      console.log(state.answer);
    });

    function submit() {
      api
        .post("/student/paper_submit", { id: state.id, answer: state.answer })
        .then((e) => {
          console.log(e);
          root.$router.push('/paperlist')
        });
    }

    return {
      state,
      calcComponentType,
      canSubmit,
      submit,
      okHide,
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

.hover {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  background-color: #00000066;
  padding: 100px;
}
</style>
