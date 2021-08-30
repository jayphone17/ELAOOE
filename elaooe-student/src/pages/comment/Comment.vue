<template>
  <v-container fluid>
    <v-textarea
      counter
      label="输入你的留言"
      :rules="state.rules"
      v-model="state.message"
    ></v-textarea>
    <v-row class="pt-5 pr-5" justify="end">
      <v-btn outlined @click="submit">发布</v-btn>
    </v-row>
    <div class="mt-10">
      <v-card
        v-for="item in state.list"
        :key="item.id"
        class="mx-auto pb-3 mb-3"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">您的留言</div>
            <v-list-item-title class="headline mb-1">
              {{ item.content }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              item.reply ? item.reply : "老师暂时还没回复"
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";

export default defineComponent({
  setup() {
    const state = reactive({
      rules: [(v) => v.length <= 140 || "最多可以有 140 个字"],
      message: "",
      list: [],
    });

    async function submit() {
      await api.post("/student/leave_message", {
        title: "",
        content: state.message,
      });
      state.message = "";
      this.$bus.$emit("toast", "发送成功");
      refresh();
    }

    async function refresh() {
      const ret = await api.get("/student/messages");
      state.list = ret.data;
      console.log("ret", ret.data);
    }

    refresh();

    return {
      state,
      submit,
    };
  },
});
</script>
