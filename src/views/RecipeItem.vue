<template>
  <v-container>
    <v-card v-if="!!recipeLoading">
      <v-skeleton-loader type="image, heading, chip@3, list-item-three-line, ossein" />
    </v-card>
    <v-card v-if="!recipeLoading">
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

const route = useRoute();
const recipeStore = useRecipeStore();
const { item: getRecipe, itemLoading: getRecipeLoading } = storeToRefs(recipeStore);

const recipe = computed(() => getRecipe.value(route.params.id));
const recipeLoading = computed(() => getRecipeLoading.value(route.params.id));


onMounted(async () => {
  try {
    await recipeStore.getDetail(route.params.id);
  } catch (err) {
    console.warn(`Failed to load recipe ${route.params.id}`, err);
    useRouter().push({ name: 'recipe-book' });
  }
});
</script>
