import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'recipe-book',
    component: () => import(/* webpackChunkName: "recipe-book" */ '../views/RecipeList.vue')
  },
  {
    path: '/recipe/:id',
    name: 'recipe-item',
    component: () => import(/* webpachChunkName: "recipe-book" */ '../views/RecipeItem.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
