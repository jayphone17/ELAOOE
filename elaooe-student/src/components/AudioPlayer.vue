<template>
  <div>
    <audio v-if="value !== ''" :src="audioSrc" controls class="full-width" />
  </div>
</template>

<script>
import { computed, defineComponent } from "@vue/composition-api";
import { downloadApiBase } from "../api/config";

export default defineComponent({
  props: ["value"],
  setup(props) {
    console.log("music", props.value);
    const audioSrc = computed(
      () =>
        `${props.value.startsWith("blob") ? "" : downloadApiBase}${props.value}`
    );

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
