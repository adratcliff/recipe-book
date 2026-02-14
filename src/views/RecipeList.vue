<template>
  <v-container fluid class="pa-4 pa-sm-8">

    <v-row class="align-center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search recipes..."
          variant="solo-filled"
          flat
          hide-details
          rounded="lg" />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          v-if="user.id"
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          rounded="lg"
          to="/recipes/create"
          elevation="2">
          New Recipe
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon icon="mdi-filter-variant" class="mr-2 text-grey" />

          <v-chip-group
            v-model="selectedTags"
            column
            multiple
            selected-class="bg-primary text-white">
            <v-chip
              v-for="tag in allTags"
              :key="tag"
              :value="tag"
              :text="tag"
              filter
              variant="outlined"
              size="small"
              class="text-capitalize" />
          </v-chip-group>

          <v-btn
            v-if="selectedTags.length"
            text="Clear"
            variant="text"
            size="x-small"
            color="error"
            class="ml-2"
            @click="selectedTags = []" />
        </div>
      </v-col>
    </v-row>

    <v-row v-if="recipeLoaders.list">
      <v-col
        v-for="n in 12"
        :key="n"
        cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" border rounded="lg" />
      </v-col>
    </v-row>

    <v-row v-else-if="recipeList.length">
      <v-col
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        cols="12" sm="6" md="4" lg="3">
        <v-hover v-slot:default="{ isHovering, props }">
          <v-card
            v-bind="props"
            :to="`/recipes/${recipe.id}`"
            :elevation="isHovering ? 8 : 1"
            :border="isHovering ? 'primary' : true"
            rounded="xl"
            class="recipe-card transition-swing">
            <v-img
              height="200"
              cover
              src="FILL ME IN LATER"
              class="align-end text-white">
              <template #placeholder>
                <v-row class="fill-height ma-0 align-center justify-center">
                  <v-progress-circular indeterminate color="grey-lighten-1" />
                </v-row>
              </template>

              <template #error>
                <v-row class="fill-height ma-0 align-center justify-center flex-column">
                  <v-icon size="48" color="grey-lighten-1">{{ getFoodTagCategoryIcon(recipe.tags) }}</v-icon>
                  <div class="text-caption text-grey-lighten-1 mt-2">No Image Provided</div>
                </v-row>
              </template>
              <div class="pa-3 d-flex justify-end">
                <v-chip
                  :text="'15m'"
                  size="small"
                  color="black"
                  class="opacity-80"
                  prepend-icon="mdi-clock-outline" />
              </div>
            </v-img>

            <v-card-item>
              <v-card-title class="font-weight-bold">{{ recipe.name }}</v-card-title>

              <div class="d-flex align-center ga-2 mt-1">
                <v-rating
                  :model-value="recipe.satisfaction / 2"
                  readonly
                  density="compact"
                  size="x-small"
                  active-color="amber" />
                <span class="text-caption text-medium-emphasis">(4.5)</span>
              </div>
            </v-card-item>

            <v-card-text>
              <div class="d-flex flex-wrap ga-1">
                <v-chip
                  v-for="(tag, idx) in recipe.tags.slice(0, 3)"
                  :key="idx"
                  :color="tagColor(tag)"
                  :text="capitalise(tag)"
                  size="x-small"
                  variant="flat"
                  label />
                <span v-if="recipe.tags.length > 3" class="text-caption text-grey ml-1">
                  +{{ recipe.tags.length - 3 }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row v-else justify="center" class="mt-12">
      <v-col cols="auto" class="text-center">
        <v-icon icon="mdi-silverware-clean" size="100" color="grey-lighten-2" />
        <h3 class="text-h5 text-grey mt-4">No recipes found</h3>
        <v-btn variant="text" color="primary" @click="search = ''">Clear Search</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { getFoodTagCategoryIcon } from '@/utils';
import { capitalise, tagColor } from 'shared/utils';
import { useUserStore } from 'shared/stores';

import { useRecipeStore } from '../stores';

const userStore = useUserStore();

const { self: user } = storeToRefs(userStore);

const recipeStore = useRecipeStore();
const { list: recipeList, loaders: recipeLoaders } = storeToRefs(recipeStore);

const search = ref('');
const selectedTags = ref([]);

const allTags = computed(() => {
  const tags = new Set();
  recipeList.value.forEach(recipe => {
    recipe.tags?.forEach(tag => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).sort();
});

const filteredRecipes = computed(() => {
  return recipeList.value.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.value.toLowerCase());

    const matchesTags = selectedTags.value.length === 0 || selectedTags.value.every(tag => recipe.tags.map(t => t.toLowerCase()).includes(tag));

    return matchesSearch && matchesTags;
  });
});

onMounted(async () => {
  await recipeStore.getList();
});
</script>

<style scoped>
.recipe-card {
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
}
.recipe-card:hover {
  transform: translateY(-4px);
}
.opacity-80 {
  opacity: 0.85;
}
</style>