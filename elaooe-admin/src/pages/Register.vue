<template>
  <div class="wrapper">
    <v-card class="mx-auto" max-width="600" min-width="400">
      <v-card-text>
        <p class="display-1 text--primary">注册</p>
        <v-text-field color="black" label="用户名"></v-text-field>
        <v-text-field color="black" label="密码"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="deep-purple accent-4">注册</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Register",
};
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>