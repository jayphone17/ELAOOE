<template>
  <div>
    <apexchart
      width="100%"
      height="300px"
      type="bar"
      :options="state.options"
      :series="state.options.series"
    ></apexchart>
    <v-simple-table class="mt-6">
      <thead>
        <tr>
          <th>卷子名称</th>
          <th>分数</th>
          <td>百分制</td>
          <th>正确题目数量</th>
          <th>总题目数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in state.scores" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.score }}/{{ item.totalScore }}</td>
          <td>{{ item.realScore }}</td>
          <td>{{ item.rightCount }}</td>
          <td>{{ item.totalCount }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
import { api } from "../../api";

export default defineComponent({
  setup() {
    const state = reactive({
      scores: [],
      datacollection: null,
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
        series: [
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91],
          },
        ],
      },
    });

    async function refresh() {
      const ret = await api.get("/student/papers");
      console.log("papaers", ret.data);
      const papers = ret.data.filter((item) => item.judged);
      console.log("remain", papers);
      const scores = papers.map((item) => ({
        name: item.paperTemplate.name,
        totalScore: item.totalCount * 10,
        score: item.score,
        rightCount: item.rightCount,
        notRightCount: item.totalCount - item.rightCount,
        totalCount: item.totalCount,
        realScore: Math.round((item.score / (item.totalCount * 10)) * 100),
      }));

      state.options = {
        ...state.options,
        xaxis: {
          categories: scores.map((item) => item.name),
        },
        series: [
          {
            name: "series-1",
            data: scores.map((item) => item.realScore),
          },
        ],
      };

      console.log(state.options);

      state.scores = scores;
    }

    refresh();

    return {
      state,
    };
  },
});
</script>
