<template>
  <div>
    <v-btn
      v-if="!disabled"
      :disabled="disabled"
      @click="record"
      color="green"
      style="color: white"
      >{{ state.recording ? "结束录音" : "开始录音" }}</v-btn
    >
    <v-chip class="mt-2 mb-2" v-if="disabled">你的录音</v-chip>
    <v-chip v-if="state.recording" color="green" text-color="white"
      >录音中</v-chip
    >
    <audio-player v-if="state.audioUrl" v-model="state.audioUrl" />
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from "@vue/composition-api";
import { api } from "../api";
import AudioPlayer from "./AudioPlayer.vue";

const recordAudio = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

let timer = null;

export default defineComponent({
  components: {
    AudioPlayer,
  },
  props: ["value", "disabled"],
  setup(props, context) {
    const state = reactive({
      recording: false,
      audioBlob: null,
      audioUrl: props.value,
      recorder: null,
      time: 0,
    });

    const startRecord = async () => {
      state.recorder = await recordAudio();
      state.recording = true;
      state.recorder.start();
      state.time = 0;
      timer = setInterval(() => {
        state.time++;
      }, 1000);
    };

    const stopRecord = async () => {
      const { audioBlob, audioUrl } = await state.recorder.stop();
      state.audioBlob = audioBlob;
      state.audioUrl = audioUrl;
      state.recording = false;
      const uploadFormData = new FormData();
      uploadFormData.append(
        "file",
        new File([state.audioBlob], "audio.wav", { type: "audio/wav" })
      );
      api.post("/file/upload", uploadFormData).then((res) => {
        state.audioUrl = res.data;
        console.log("pppp", res.data);
        context.emit("input", res.data);
      });
      clearInterval(timer);
    };

    const record = () => {
      if (!state.recording) {
        startRecord();
      } else {
        stopRecord();
      }
    };

    watch(props, () => {
      state.audioUrl = props.value;
    });

    return {
      state,
      startRecord,
      stopRecord,
      record,
    };
  },
});
</script>
