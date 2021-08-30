<template>
  <div>
    <audio v-if="value !== ''" :src="audioSrc" controls class="full-width" />
    <v-chip color="red" text-color="white" v-else>请上传音频</v-chip>
  </div>
</template>

<script>
import { computed, defineComponent } from "@vue/composition-api";
import { downloadApiBase } from "../api/config";

export default defineComponent({
  props: ["value"],
  setup(props) {
    console.log("music", props.value);
    const audioSrc = computed(() => `${downloadApiBase}${props.value}`);

    return {
      audioSrc,
    };
  },
});
</script>


<style scoped>
.full-width {
  box-sizing: border-box;
  width: 100%;
}
</style>
