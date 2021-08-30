<template>
  <v-card class="ma-2" width="360">
    <v-card-text>
      <div class="text-h5" @click="logOwnSchema">
        {{ schema.name }}
      </div>
      <div class="text-h6">
        {{ schema.content.content }}
      </div>
      <audio-player v-model="this.ownSchema.content.audioSrc" />
    </v-card-text>
    <v-card-actions>
      <v-btn text color="teal accent-4" @click="reveal = true"> 修改 </v-btn>
      <v-dialog v-model="deleteDialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="red lighten-1" v-bind="attrs" v-on="on">
            删除
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            删除后不可恢复，确定要删除吗？
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteDialog = false">
              取消
            </v-btn>
            <v-btn color="green darken-1" text @click="onDelete"> 删除 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="reveal" class="transition-fast-in-fast-out v-card--reveal">
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <v-col>
              <v-text-field label="题目标题" v-model="ownSchema.name" required>
              </v-text-field>
            </v-col>
          </v-row>
          <uploader v-model="ownSchema.content.audioSrc" />
          <v-row no-gutters>
            <v-col>
              <v-textarea
                label="题目内容"
                v-model="ownSchema.content.content"
                @input="ownSchema.content.answer = ''"
                required
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-btn text color="teal accent-4" @click="finish"> 完成 </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
import Uploader from "../Uploader.vue";
import AudioPlayer from "../AudioPlayer.vue";
import { api } from "../../api";

export default {
  name: "OralWithAudio",
  components: { Uploader, AudioPlayer },
  props: {
    schema: Object,
    sideEffect: Object,
  },
  data() {
    return {
      msg: "Hello",
      reveal: this.$props.sideEffect.editing,
      // Is delete dialog show.
      deleteDialog: false,
      ownSchema: this.$props.schema,
    };
  },
  computed: {
    genId() {
      if (this.ownSchema.content.fields.length === 0) {
        return 0;
      }
      return (
        this.ownSchema.content.fields[this.ownSchema.content.fields.length - 1]
          .id + 1
      );
    },
  },
  created() {
    this.$bus.$on("stop-edit-all", () => {
      this.reveal = false;
    });
  },
  methods: {
    addField() {
      this.ownSchema.content.answer = "";
      this.ownSchema.content.fields.push({
        id: this.genId,
        answer: "",
      });
    },
    removeField(id) {
      this.ownSchema.content.answer = "";
      this.ownSchema.content.fields = this.ownSchema.content.fields.filter(
        (v) => v.id !== id
      );
    },
    clear() {
      this.ownSchema.content.answer = "";
    },
    openUploadFile() {
      const inputObj = document.createElement("input");
      inputObj.setAttribute("id", "my_inputObj");
      inputObj.setAttribute("type", "file");
      inputObj.setAttribute("style", "visibility:hidden");
      document.body.appendChild(inputObj);
      inputObj.addEventListener("change", (e) => {
        console.log("file", e.target.files);
      });
      inputObj.click();
    },
    onDelete() {
      this.$bus.$emit("ping", true);
      this.$emit("delete-question", this.ownSchema.id);
      this.deleteDialog = false;
    },
    async finish() {
      this.reveal = false;
      this.logOwnSchema();
      // upload
      if (this.ownSchema.id?.startsWith?.("tobeadded")) {
        const tobecreate = { ...this.ownSchema };
        delete tobecreate.id;
        const ret = await api.post("/mentor/question", tobecreate);
        this.ownSchema.id = ret.data;
        console.log(this.ownSchema);
        console.log("uploaded", ret.data);
      } else {
        const ret = await api.put("/mentor/question", this.ownSchema);
        console.log(ret.data);
      }
      this.$bus.$emit("edit-done");
    },
    logOwnSchema() {
      console.log("own schema", JSON.stringify(this.ownSchema, null, 2));
    },
  },
};
</script>

<style>
.v-card--reveal {
  top: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
  z-index: 999;
}
</style>