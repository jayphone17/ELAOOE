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
    <v-row align="center" justify="end" class="mt-3 pr-5">
      <!-- <v-container class="max-width">
        <v-pagination v-model="page" :length="pageLength"></v-pagination>
      </v-container> -->
      <v-col cols="4"
        ><v-text-field v-model="filter" label="搜索"></v-text-field
      ></v-col>
      <v-btn @click="showManyDialog" class="mr-5" color="primary" depressed>批量录入</v-btn>
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
        v-for="schema in filteredQuestions"
        :key="schema.id"
        :schema="schema"
        :sideEffect="cSideEffect(schema.id)"
        @delete-question="deleteQuestion"
      ></component>
    </div>
    <v-dialog
      v-model="manyDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="hideManyDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <v-toolbar-title>批量录入</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-textarea v-model="needToInput"></v-textarea>
          <v-row class="pr-5" justify="end" align="end">
            <v-btn @click="submitInput" color="primary">录入</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
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
import { questionParser } from "../../utils/question";
import { api } from "../../api";
import { readAll } from "../../utils/parser";

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
      manyDialog: false,
      needToInput: "",
      filter: "",
    };
  },
  computed: {
    curTabName() {
      return Object.entries(QuestionType)[this.curTab][0];
    },
    filteredQuestions() {
      if (!this.filter) {
        return this.curPageQuestions;
      }
      return this.curPageQuestions.filter(
        (item) => item.name.indexOf(this.filter) > -1
      );
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
    showManyDialog() {
      this.manyDialog = true;
      this.needToInput = "例子";
    },
    hideManyDialog() {
      this.manyDialog = false;
      this.needToInput = "";
    },
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
    async submitInput() {
      const questions = readAll(this.needToInput);

      let total = questions.length;
      let i = 0;
      for (const question of questions) {
        await api.post("/mentor/question", question);
        i++;
        this.$bus.$emit("message", `${i}/${total}`);
      }
      console.log(questions);
      this.hideManyDialog();

      api.get(`/mentor/question?type=${this.curTabName}`).then((res) => {
        this.curPageQuestions = res.data.map(questionParser);
      });
    },
  },
  watch: {
    curTabName(cur, prev) {
      console.log(cur, prev);
      this.editing = false;
      this.curComponentType = QuestionComponentType[cur];
      this.curPageQuestions = [];
      api.get(`/mentor/question?type=${cur}`).then((res) => {
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