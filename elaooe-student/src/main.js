import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionList from './pages/question/QuestionList';
import PaperList from './pages/paper/PaperList';
import PaperDetail from './pages/paper/PaperDetail';
import PaperShow from './pages/paper/PaperShow';
import StudentList from './pages/student/StudentList';
import StarList from './pages/star/StarList';
import MicTest from './pages/mictest/MicTest';
import Home from './pages/home/Home';
import Score from './pages/score/Score';
import Comment from './pages/comment/Comment';
import Notice from './pages/notice/Notice';
import vuetify from './plugins/vuetify';
import CompositionApi from '@vue/composition-api';

import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);
Vue.use(CompositionApi);
Vue.config.productionTip = false;
Vue.use(VueRouter);

Vue.component('apexchart', VueApexCharts);

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/questionlist', component: QuestionList },
  { path: '/paperlist', component: PaperList },
  { path: '/paperdetail', component: PaperDetail },
  { path: '/papershow', component: PaperShow },
  { path: '/studentlist', component: StudentList },
  { path: '/star', component: StarList },
  { path: '/mictest', component: MicTest },
  { path: '/home', component: Home },
  { path: '/score', component: Score },
  { path: '/comment', component: Comment },
  { path: '/notice', component: Notice },
];

const router = new VueRouter({
  routes,
});

Vue.prototype.$bus = new Vue();
window.$bus = Vue.prototype.$bus;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
