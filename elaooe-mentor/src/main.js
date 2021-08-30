import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionList from './pages/question/QuestionList';
import PaperList from './pages/paper/PaperList';
import PaperDetail from './pages/paper/PaperDetail';
import StudentList from './pages/student/StudentList';
import vuetify from './plugins/vuetify';
import CompositionApi from '@vue/composition-api';
import CheckPaperList from './pages/paper/CheckPaperList';
import PaperSubmitList from './pages/paper/PaperSubmitList';
import UserPaperDetail from './pages/paper/UserPaperDetail';
import Home from './pages/Home';
import Comment from './pages/comment/Comment';
import Notice from './pages/notice/Notice';

import VueApexCharts from 'vue-apexcharts';

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
  { path: '/studentlist', component: StudentList },
  { path: '/check_paper', component: CheckPaperList },
  { path: '/paper_submit_list', component: PaperSubmitList },
  { path: '/user_paper_detail', component: UserPaperDetail },
  { path: '/home', component: Home },
  {
    path: '/comment',
    component: Comment,
  },
  {
    path: '/notice',
    component: Notice,
  },
];

const router = new VueRouter({
  routes,
});

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
