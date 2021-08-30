<template>
  <div>
    <v-toolbar dense>
      <v-btn icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>卷面编辑{{ type }}</v-toolbar-title>
      <v-spacer />
      <v-btn @click="publish"> 发布试卷 </v-btn>
    </v-toolbar>
    <div class="page-container">
      <div class="left">
        <v-row>
          <v-col>
            <v-select
              :items="questionTypes"
              v-model="curQuestionType"
              label="题型选择"
            ></v-select>
          </v-col>
        </v-row>
        <div v-for="schema in questions" :key="schema.id">
          <component
            :is="curComponentType"
            :schema="schema"
            :sideEffect="sideEffect"
          >
          </component>
          <v-row>
            <v-col>
              <v-btn class="full-width" @click="addToPaper(schema)"
                >添加到卷子</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="right">
        <div class="titletitle">
          <v-text-field v-model="state.title" label="卷子名称"></v-text-field>
        </div>
        <div v-for="(schema, idx) in state.paper" :key="schema.id">
          <v-chip color="secondary">Question {{ idx + 1 }}</v-chip>
          <component
            :is="transComponentType(schema.type)"
            :schema="schema"
            :sideEffect="sideEffect"
            @delete-question="deleteFromPaper(schema.id)"
          ></component>
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
  ref,
  watch,
} from "@vue/composition-api";
import { api } from "../../api";
import {
  QuestionComponentType,
  QuestionName,
  QuestionNameToType,
} from "../../constants/question";
import ListenSelect from "../../components/question/ListenSelect.vue";
import ListenDetermine from "../../components/question/ListenDetermine";
import OralWithText from "../../components/question/OralWithText";
import OralWithAudio from "../../components/question/OralWithAudio";
import { questionParser } from "../../utils/question";

export default defineComponent({
  components: {
    ListenSelect,
    ListenDetermine,
    OralWithText,
    OralWithAudio,
  },
  setup(props, { root }) {
    const type = ref(root.$route.query.type);
    const id = ref(root.$route.query.id);
    const state = reactive({
      count: 0,
      paper: [],
      title: "",
    });
    // edit
    console.log("type", type.value);
    if (type.value === "edit") {
      api.get(`/mentor/papertemplate?id=${id.value}`).then((e) => {
        const detail = JSON.parse(e.data.detail);
        state.paper = detail;
        state.title = e.data.name;
      });
    }
    const questionTypes = ref(Object.values(QuestionName));
    const curQuestionType = ref("听力选择");
    const curQuestionTypeKey = computed(() => {
      return QuestionNameToType[curQuestionType.value];
    });
    const curComponentType = computed(() => {
      return QuestionComponentType[curQuestionTypeKey.value];
    });

    const questions = ref([]);
    /**
     * Functions
     */
    const getQuestions = () => {
      api.get(`/mentor/question?type=${curQuestionTypeKey.value}`).then((e) => {
        questions.value = e.data.map(questionParser);
      });
    };

    const transComponentType = (key = "") =>
      QuestionComponentType[key.toUpperCase()];

    const addToPaper = (content) => {
      console.log("添加到卷子", JSON.stringify(content, null, 2));
      if (state.paper.some((_) => _.id === content.id)) {
        return;
      }
      state.paper.push(content);
      console.log(state);
    };

    const deleteFromPaper = (id) => {
      state.paper.splice(
        state.paper.findIndex((_) => _.id === id),
        1
      );
    };

    const publish = () => {
      if (type.value === "new") {
        api
          .post("/mentor/papertemplate", { name: state.title, detail: state.paper })
          .then(() => {
            root.$router.push("/paperlist");
          });
      } else if (type.value === "edit") {
        // TODO edit
        api
          .post("/mentor/papertemplate", {
            id: id.value,
            name: state.title,
            detail: state.paper,
          })
          .then(() => {
            root.$router.push("/paperlist");
          });
      }
    };

    getQuestions();

    // 监听选项变化然后更新问题
    watch(
      () => curQuestionTypeKey.value,
      () => {
        getQuestions();
      }
    );

    return {
      type,
      questionTypes,
      curQuestionType,
      curQuestionTypeKey,
      curComponentType,
      questions,
      getQuestions,
      addToPaper,
      transComponentType,
      state,
      deleteFromPaper,
      publish,
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

.left {
  width: 300px;
  padding: 20px;
  height: calc(100vh - 64px);
  overflow: scroll;
}

.right {
  flex-grow: 1;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-right: 20px;
}
.full-width {
  width: 100%;
  margin-left: 8px;
}
.spacer {
  margin-right: 10px;
}

.titletitle {
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  height: 80px;
}
</style>
