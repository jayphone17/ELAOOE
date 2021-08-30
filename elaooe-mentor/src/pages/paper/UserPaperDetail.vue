<template>
  <div>
    <v-row align="end" justify="end" class="mt-3 pr-5">
      <v-btn
        color="primary"
        :disabled="!canSubmit"
        depressed
        @click="submitScore"
        >提交分数</v-btn
      >
    </v-row>
    <div class="middle pt-5">
      <div :key="question.id" v-for="(question, index) in state.questions">
        <v-chip color="green" text-color="white">第{{ index + 1 }}题</v-chip>
        <v-chip
          v-if="state.rank[question.id] >= 0"
          class="ml-5"
          color="blue"
          text-color="white"
          >{{ state.rank[question.id] }} 分</v-chip
        >
        <v-chip v-else class="ml-5" color="red" text-color="white"
          >未批阅</v-chip
        >
        <div class="middle">
          <component
            :is="calcComponentType(question.type)"
            :schema="question"
            :sideEffect="state.sideEffect"
            v-model="state.answer[question.id]"
            disabled
          />
          <v-rating
            v-if="
              question.type === 'oral_with_audio' ||
              question.type === 'oral_with_text'
            "
            hover
            length="10"
            color="red lighten-3"
            size="20"
            v-model="state.rank[question.id]"
          ></v-rating>
        </div>
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
import ListenSelect from "../../components/question-show/ListenSelectShow.vue";
import ListenDetermine from "../../components/question-show/ListenDetermineShow";
import OralWithText from "../../components/question-show/OralWithTextShow";
import OralWithAudio from "../../components/question-show/OralWithAudioShow";
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
      const { data } = await api.get(`/mentor/paper?id=${state.id}`);
      const questionTemplate = data.paperTemplate;
      state.title = questionTemplate.name;
      state.questions = JSON.parse(questionTemplate.detail);
      state.answer = JSON.parse(data.answer);
      state.rank = JSON.parse(data.rank);
      console.log("rank", state.rank);
      console.log("answer", state.answer);
      console.log(state.questions);
    }

    const canSubmit = computed(() => {
      for (let key in state.rank) {
        if (state.rank[key] === -1) {
          return false;
        }
      }
      return true;
    });

    initPaper();

    watch(state, () => {
      console.log(JSON.stringify(state.rank, null, 2));
    });

    function submitScore() {
      api
        .post("/mentor/submit_score", { id: state.id, rank: state.rank })
        .then(() => {
          root.$router.push("/check_paper");
        });
    }

    return {
      state,
      calcComponentType,
      canSubmit,
      submitScore,
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
