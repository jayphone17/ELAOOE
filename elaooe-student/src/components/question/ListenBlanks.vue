<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <div class="text-h6">
        {{ schema.content }}
      </div>
      <div class="text-h6">答案：</div>
      <div>
        <ol>
          <li v-for="field in schema.fields" :key="field.id" class="text-h7">
            {{ field.answer }}
          </li>
        </ol>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="teal accent-4" @click="reveal = true"> 修改 </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="reveal" class="transition-fast-in-fast-out v-card--reveal">
        <v-card-text class="pb-0">
          <p class="display-1 text--primary">Origin</p>
          <p>
            late 16th century (as a noun denoting a place where alms were
            distributed): from medieval Latin eleemosynarius, from late Latin
            eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’
          </p>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-btn text color="teal accent-4" @click="reveal = false">
            完成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "ListenBlanks",
  props: {
    schema: Object,
  },
  data() {
    return {
      msg: "Hello",
      reveal: false,
    };
  },
};
</script>

<style>
.v-card--reveal {
  top: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>