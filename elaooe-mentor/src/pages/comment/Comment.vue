<template>
  <v-container>
    <v-card v-for="value in s.messages" :key="value.id" class="pa-4 ma-4">
      <div class="text-h6">{{ value.content }}</div>
      <div class="text-h7">来自-{{ value.name }}</div>
      <div class="text-h7">
        回复-{{ value.reply ? value.reply : "暂无回复" }}
      </div>
      <v-row justify="end">
        <v-btn @click="reply(value.id)" outlined>回复</v-btn>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";

export default defineComponent({
  setup() {
    const s = reactive({
      messages: [],
    });
    async function refresh() {
      const { data } = await api.get("/mentor/message");
      console.log("message", data);
      s.messages = data;
    }

    async function reply(id) {
      const reply = window.prompt("请输入你的回复");
      await api.post("/mentor/reply", { id, reply });
      refresh();
    }

    refresh();

    return {
      s,
      refresh,
      reply,
    };
  },
});
</script>
