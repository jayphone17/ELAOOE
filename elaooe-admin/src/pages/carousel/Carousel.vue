<template>
  <div>
    <v-row class="ma-5" justify="end"
      ><v-btn @click="add">新建轮播图</v-btn></v-row
    >
    <v-container>
      <v-card v-for="v in state.carousels" :key="v.id">
        <div class="text-h6">{{ v.title }}</div>
        <div><img :src="genImgUrl(v.imgSrc)" style="max-height: 300px" /></div>
        <v-btn
          @click="edit(v.id)"
          color="blue"
          style="color: white"
          class="ma-4"
          >修改</v-btn
        >
        <v-btn @click="deleteA(v.id)" class="ma-4">删除</v-btn>
      </v-card>
    </v-container>
    <v-dialog
      v-model="state.detailShow"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="hide">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>轮播图</v-toolbar-title>
        </v-toolbar>
        <div class="pa-5">
          <image-uploader v-model="state.imgSrc" />
          <v-text-field
            class="mt-5"
            label="标题"
            v-model="state.title"
          ></v-text-field>
          <v-row>
            <v-btn @click="post">发送</v-btn>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";
import { downloadApiBase } from "../../api/config";
import ImageUploader from "../../components/ImageUploader.vue";

export default defineComponent({
  components: {
    ImageUploader,
  },
  setup() {
    const state = reactive({
      carousels: [],
      detailShow: false,
      imgSrc: "",
      title: "",
      id: null,
    });

    async function refresh() {
      const { data } = await api.get("/student/carousel");
      state.carousels = data;
    }

    refresh();

    function add() {
      state.detailShow = true;
    }

    function hide() {
      state.detailShow = false;
      state.imgSrc = "";
      state.title = "";
    }

    function edit(id) {
      state.id = id;
      const cur = state.carousels.find((item) => item.id === id);
      state.imgSrc = cur.imgSrc;
      state.title = cur.title;
      add();
    }

    async function post() {
      console.log(state.imgSrc, state.title);
      const content = {
        title: state.title,
        imgSrc: state.imgSrc,
      };

      await api.post("/mentor/carousel", content);
      state.detailShow = false;
      refresh();
    }

    async function deleteA(id) {
      await api.delete(`/mentor/carousel?id=${id}`);
      refresh();
    }

    function genImgUrl(url) {
      return `${downloadApiBase}${url}`;
    }

    return {
      state,
      add,
      hide,
      post,
      genImgUrl,
      edit,
      deleteA,
    };
  },
});
</script>
