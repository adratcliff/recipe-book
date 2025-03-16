<template>
  <v-container>
    <v-card>
      <v-card-title>{{ recipe.name }}</v-card-title>
      <v-card-text>{{ recipe }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useRecipeStore } from '../stores';

// eslint-disable-next-line no-unused-vars
const details = {
  id1: {
    id: 'id1',
    name: 'brownie',
    tags: ['desert', 'chocolate', 'mint'],
    created: '2024-10-10T20:10:00.000Z',
    updated: '2024-10-20T10:10:00.000Z',
    times: {
      prep: { duration: 15, unit: 'minute' },
      cook: { duration: 20, unit: 'minute' },
    },
    difficulty: 1,
    satisfaction: 5,
    recipe: [
      {
        section: 'base',
        ingredients: [
          { item: 'egg', quantity: 2, unit: '' },
          { item: 'sugar', quantity: 2, unit: 'tablespoon' },
          { item: 'flour', quantity: 1, unit: 'cup' },
        ],
        tools: [
          'Pot',
        ],
        instructions: [
          'Crack egg in pot',
          'Add sugar to pot',
        ],
      }
    ]
  },
};

const route = useRoute();
const recipeStore = useRecipeStore();
const { item: getRecipe } = storeToRefs(recipeStore);

const recipe = computed(() => getRecipe.value(route.params.id));

onMounted(async () => {
  try {
    await recipeStore.getDetail(route.params.id);
  } catch (err) {
    console.warn(`Failed to load recipe ${route.params.id}`, err);
    useRouter().push({ name: 'recipe-book' });
  }
});
</script>
