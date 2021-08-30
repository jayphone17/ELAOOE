<template>
  <v-card class="pa-5 ma-5">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>麦克风测试</v-list-item-title>
        <v-btn @click="stopStreams">shut</v-btn>
        <v-list-item-subtitle>清说话以测试您的音量</v-list-item-subtitle>
        <v-progress-linear :value="state.volumn"></v-progress-linear>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>耳机测试</v-list-item-title>
        <v-list-item-subtitle>点击播放音乐</v-list-item-subtitle>
        <audio
          src="https://api.lin-eng.raka.link/file/download?filename=test.mp3"
          controls="controls"
          class="full-width"
        ></audio>
      </v-list-item-content>
    </v-list-item>
    <v-row align="end" justify="end">
      <v-btn @click="ok" class="mt-3 mr-9" outlined>没问题</v-btn>
    </v-row>
  </v-card>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  setup(props, context) {
    const state = reactive({
      volumn: 0,
      stream: null,
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const jsNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(jsNode);
        jsNode.connect(audioContext.destination);
        state.stream = stream;
        jsNode.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;

          const length = array.length;
          for (let i = 0; i < length; i++) {
            values += array[i];
          }

          const average = values / length;
          state.volumn = Math.round(average);
        };
      });
    }

    function stopStreams() {
      state.stream.getTracks().forEach((track) => track.stop());
      state.volumn = 100;
    }

    function ok() {
      context.emit("ok", true);
    }

    return {
      state,
      stopStreams,
      ok,
    };
  },
});
</script>
