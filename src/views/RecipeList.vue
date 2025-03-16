<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="recipe in recipeList"
        :key="`recipe-${recipe.id}`"
        lg="4"
        md="6"
        cols="12">
        <v-card :to="`/recipes/${recipe.id}`">
          <v-card-title class="d-flex align-center">
            {{ recipe.name }}
            <v-spacer />
            <span class="text-subtitle-2 text-grey">15 m</span>
          </v-card-title>
          <v-card-text>
            <v-chip
              v-for="(tag, tagIdx) in recipe.tags"
              :key="`recipe-${recipe.id}-tag-${tagIdx}`"
              :text="tag"
              class="mr-1 mt-1"
              size="small"
              label />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useRecipeStore } from '../stores';

// eslint-disable-next-line no-unused-vars
const list = {
  id1: {
    id: 'id1',
    name: 'brownie',
    tags: ['desert', 'chocolate', 'mint'],
  },
  id2: {
    id: 'id2',
    name: 'parmi',
    tags: ['dinner', 'chicken'],
  },
};

const recipeStore = useRecipeStore();
const { list: recipeList } = storeToRefs(recipeStore);

onMounted(async () => {
  await recipeStore.getList();
});
</script>
