import { createRouter, createWebHistory } from 'vue-router';
import TestPage from '../components/TestPage.vue';
import TestAnswers from '../components/TestAnswers.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: TestPage },
    { path: '/answers/:task_number', name: 'answers', component: TestAnswers, props: true },
  ],
});

export default router;


