<template>
  <v-card class="ma-2" width="360">
    <v-card-text>
      <div class="text-h5">
        {{ schema.name }}
      </div>
      <div class="text-h6">
        {{ schema.content.content }}
      </div>
      <audio-player v-model="this.ownSchema.content.audioSrc" />
      <recorder v-model="state.answer" :disabled="disabled"/>
    </v-card-text>
  </v-card>
</template>

<script>
import Uploader from "../Uploader.vue";
import AudioPlayer from "../AudioPlayer.vue";
import Recorder from "../Recorder.vue";
// import { api } from "../../api";
import { defineComponent, reactive, watch } from "@vue/composition-api";

// const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default defineComponent({
  setup(props, context) {
    const state = reactive({
      answer: props.value,
    });

    console.log("lll", state.answer);

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
  components: { Uploader, AudioPlayer, Recorder },
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
  methods: {},
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