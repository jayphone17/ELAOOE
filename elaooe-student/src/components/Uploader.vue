<template>
  <div class="full-width">
    <v-btn color="green" class="white--text full-width" @click="upload">{{
      value === "" ? "上传音频" : "上传成功"
    }}</v-btn>
    <audio v-if="value !== ''" :src="downloadApi" controls class="full-width" />
  </div>
</template>

<script>
import { defineComponent, ref } from "@vue/composition-api";
import { api } from "../api";
import { downloadApiBase } from "../api/config";
export default defineComponent({
  props: ["value"],
  setup(props, context) {
    const downloadApi = ref(`${downloadApiBase}${props.value}`);
    console.log("Value", props.value, downloadApi.value);
    /**
     * Upload Function
     */
    // console.log("value", props.value);
    const getFile = () =>
      new Promise((resolve) => {
        const uploaderInput = document.createElement("input");
        uploaderInput.type = "file";
        uploaderInput.accept = "audio/mpeg";
        uploaderInput.style.opacity = "0";
        uploaderInput.style.height = "0";
        document.body.appendChild(uploaderInput);
        /**
         * Add Listener
         */
        uploaderInput.addEventListener("change", (e) => {
          resolve(e.target.files);
        });
        uploaderInput.click();
      });

    const upload = async () => {
      const files = await getFile();
      console.log("🍺", files[0]);
      console.log("url", URL.createObjectURL(files[0]));
      const uploadFormData = new FormData();
      uploadFormData.append("file", files[0]);
      uploadFormData.append("message", "hello");
      console.log(uploadFormData);
      api.post("/file/upload", uploadFormData).then((res) => {
        console.log("upload", res);
        context.emit("input", res.data);
        downloadApi.value = `${downloadApiBase}${res.data}`;
      });
    };
    return { upload, downloadApi };
  },
});
</script>

<style scoped>
.full-width {
  box-sizing: border-box;
  width: 100%;
}
</style>
