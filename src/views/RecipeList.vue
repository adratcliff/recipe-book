<template>
  <v-container fluid>
    <v-row v-if="!!recipeLoaders.list">
      <v-col
        v-for="loaderIdx in 12"
        :key="`recipe-loader-${loaderIdx}`"
        lg="4"
        md="6"
        cols="12">
        <v-skeleton-loader type="image, heading, chip@3" />
      </v-col>
    </v-row>
    <v-row v-if="!recipeLoaders.list">
      <v-col cols="12" class="d-flex">
        <v-spacer />
        <v-btn
          v-if="user.id"
          text="Recipe"
          prepend-icon="mdi-plus"
          variant="outlined"
          color="primary"
          to="/recipes/create" />
      </v-col>
    </v-row>
    <v-row v-if="!recipeLoaders.list">
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
            <v-row class="d-flex align-center">
              <v-col cols="12">
                <v-chip
                  v-for="(tag, tagIdx) in recipe.tags"
                  :key="`recipe-${recipe.id}-tag-${tagIdx}`"
                  :text="capitalise(tag)"
                  :color="tagColor(tag)"
                  class="mr-1 mt-1" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { capitalise, tagColor } from 'shared/utils';
import { useUserStore } from 'shared/stores';

import { useRecipeStore } from '../stores';

const userStore = useUserStore();

const { self: user } = storeToRefs(userStore);

const recipeStore = useRecipeStore();
const { list: recipeList, loaders: recipeLoaders } = storeToRefs(recipeStore);

onMounted(async () => {
  await recipeStore.getList();
});
</script>
