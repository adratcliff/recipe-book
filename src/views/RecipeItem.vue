<template>
  <v-container>
    <v-card>
      <v-card-title>{{ recipe.name }}</v-card-title>
      <v-card-text>{{ recipe }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
          { item: 'egg', quantity: 2, quantityType: '' },
          { item: 'sugar', quantity: 2, quantityType: 'tablespoon' },
          { item: 'flour', quantity: 1, quantityType: 'cup' },
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

export default {
  name: 'RecipeItem',
  setup() {
    const route = useRoute();

    onBeforeMount(() => {
      if (route.params.id in details) return;
      useRouter().push({ name: 'recipe-book' });
    });

    return {
      recipe: details[route.params.id] || {},
    };
  },
};
</script>
