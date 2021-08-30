<template>
  <div>
    <v-row class="mt-5 pr-5" justify="end">
      <v-btn @click="newNotice">新建公告</v-btn>
    </v-row>
    <v-container>
      <v-card v-for="value in s.list" :key="value.id" class="pa-5">
        <div class="text-h6">{{ value.title }}</div>
        <div class="text-h7">{{ value.name }}</div>
        <div class="text-h7">{{ new Date(value.time).toLocaleString() }}</div>
        <v-row justify="end">
          <v-btn
            @click="editNotice(value.id)"
            color="blue"
            style="color: white"
            outlined
            class="mr-3"
            >编辑</v-btn
          >
          <v-btn
            @click="deleteNotice(value.id)"
            color="red"
            style="color: white"
            outlined
            >删除</v-btn
          >
        </v-row>
      </v-card>
      <v-dialog
        v-model="s.editDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn dark text @click="hideEditDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>公告</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-textarea v-model="s.noticeContent" label="公告内容"></v-textarea>
            <v-text-field
              v-model="s.noticeName"
              label="发布人姓名"
            ></v-text-field>
            <v-text-field
              v-model="s.noticeCode"
              label="发布人工号"
            ></v-text-field>
            <v-row justify="end">
              <v-btn @click="postNotice">发布</v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";

export default defineComponent({
  setup() {
    const s = reactive({
      list: [],
      editDialog: false,
      noticeContent: "",
      noticeName: "",
      noticeCode: "",
      id: null,
    });
    async function refresh() {
      const { data } = await api.get("/student/notice");
      console.log(data);
      s.list = data;
    }

    async function deleteNotice(id = 0) {
      await api.delete(`/mentor/notice?id=${id}`);
      refresh();
    }

    refresh();

    function hideEditDialog() {
      s.editDialog = false;
      s.noticeContent = "";
      s.noticeName = "";
      s.noticeCode = "";
    }

    function newNotice() {
      s.editDialog = true;
    }

    async function postNotice() {
      const content = {
        title: s.noticeContent,
        name: s.noticeName,
        code: s.noticeCode,
        time: new Date().valueOf(),
      };
      if (!s.id) {
        await api.post("/mentor/notice", content);
      } else {
        await api.post("/mentor/notice", { ...content, id: s.id });
      }

      hideEditDialog();

      refresh();

      console.log(content);
    }

    async function editNotice(id) {
      s.id = id;
      s.editDialog = true;
      const curContent = s.list.find((item) => item.id === id);
      s.noticeContent = curContent.title;
      s.noticeName = curContent.name;
      s.noticeCode = curContent.code;
    }

    return {
      s,
      deleteNotice,
      hideEditDialog,
      newNotice,
      postNotice,
      editNotice,
    };
  },
});
</script>
