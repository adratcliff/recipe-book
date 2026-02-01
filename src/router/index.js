import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'recipe-book',
    component: () => import('../views/RecipeList.vue')
  },
  {
    path: '/recipe/:id',
    name: 'recipe-item',
    component: () => import('../views/RecipeItem.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
