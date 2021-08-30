<template>
  <div>
    <v-tabs
      @change="switchTab"
      :value="curTab"
      background-color="#ffffff"
      color="#346758"
      grow
    >
      <v-tab v-for="tab in tabs" :key="tab.key">{{ tab.value }}</v-tab>
    </v-tabs>
    <v-row align="end" justify="end" class="mt-3 pr-5">
      <!-- <v-container class="max-width">
        <v-pagination v-model="page" :length="pageLength"></v-pagination>
      </v-container> -->
      <v-btn @click="newQuestion" color="primary" depressed>新建问题</v-btn>
    </v-row>
    <v-snackbar v-model="editingSnack" :timeout="3000">
      请先提交您新建的题目
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="editingSnack = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="grid">
      <component
        :is="curComponentType"
        v-for="schema in curPageQuestions"
        :key="schema.id"
        :schema="schema"
        :sideEffect="cSideEffect(schema.id)"
        @delete-question="deleteQuestion"
      ></component>
    </div>
  </div>
</template>

<script>
import {
  QuestionType,
  QuestionName,
  QuestionGenMethod,
  QuestionComponentType,
} from "../../constants/question";
import ListenSelect from "../../components/question/ListenSelect.vue";
import ListenDetermine from "../../components/question/ListenDetermine";
import OralWithText from "../../components/question/OralWithText";
import OralWithAudio from "../../components/question/OralWithAudio";
import axios from "axios";
import { questionParser } from "../../utils/question";
import { api } from "../../api";

export default {
  name: "QuestionList",
  components: {
    ListenSelect,
    ListenDetermine,
    OralWithText,
    OralWithAudio,
  },
  data() {
    return {
      editing: false,
      editingSnack: false,
      tabs: Object.values(QuestionType).map((type) => ({
        key: type,
        value: QuestionName[type],
      })),
      curTab: 0,
      curPageQuestions: [],
      page: 1,
      pageLength: 100,
      curComponentType: "listen-select",
      sideEffects: {},
    };
  },
  computed: {
    curTabName() {
      return Object.entries(QuestionType)[this.curTab][0];
    },
  },
  created() {
    this.$bus.$on("edit-done", () => {
      this.editing = false;
    });
    api.get(`/mentor/question?type=${this.curTabName}`).then((res) => {
      this.curPageQuestions = res.data.map(questionParser);
    });
  },
  methods: {
    deleteQuestion(id) {
      this.curPageQuestions = this.curPageQuestions.filter(
        (ques) => ques.id !== id
      );
      api.delete(`/mentor/question?id=${id}`);
    },
    cSideEffect(id) {
      if (this.sideEffects[id]) {
        return this.sideEffects[id];
      }
      return {
        editing: false,
      };
    },
    newQuestion() {
      if (this.editing) {
        this.editingSnack = true;
        return;
      }
      if (QuestionGenMethod[this.curTabName]) {
        const newQuestion = QuestionGenMethod[this.curTabName]();
        this.curPageQuestions.splice(0, 0, newQuestion);
        this.sideEffects[newQuestion.id] = {
          editing: true,
        };
        this.editing = true;
      }
    },
    switchTab(tab) {
      this.curTab = tab;
      // refresh page
    },
  },
  watch: {
    curTabName(cur, prev) {
      console.log(cur, prev);
      this.editing = false;
      this.curComponentType = QuestionComponentType[cur];
      this.curPageQuestions = [];
      axios.get(`/mentor/question?type=${cur}`).then((res) => {
        this.curPageQuestions = res.data.map(questionParser);
      });
      this.page = 1;
    },
  },
};
</script>

<style scoped>
.grid {
  display: flex;
  padding: 10px;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>