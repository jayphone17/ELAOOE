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
      <div class="text-h7">选项：</div>
      <v-radio-group v-model="state.answer" :disabled="disabled">
        <v-radio
          v-for="field in ownSchema.content.fields"
          :key="field.id"
          :label="field.answer"
          :value="field.answer"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script>
import AudioPlayer from "../AudioPlayer.vue";
import { api } from "../../api";
import { defineComponent, reactive, watch } from "@vue/composition-api";

export default defineComponent({
  setup(props, context) {
    const state = reactive({
      answer: props.value,
    });

    watch(state, () => {
      context.emit("input", state.answer);
    });

    watch(props, () => {
      state.answer = props.value;
    });

    return {
      state,
    };
  },
  components: {
    AudioPlayer,
  },
  props: {
    schema: Object,
    sideEffect: Object,
    value: String,
    disabled: Boolean,
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
});
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