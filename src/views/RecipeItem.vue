<template>
  <v-container>
    <v-card v-if="!!recipeLoading">
      <v-skeleton-loader type="image, heading, chip@3, list-item-three-line, ossein" />
    </v-card>
    <v-row v-if="!recipeLoading">
      <v-col cols="12">
        <v-card v-if="!recipeLoading">
          <v-card-title>
            <v-row>
              <v-col sm="12" md="8">
                <v-row>
                  <v-col sm="12" md="6" class="d-flex align-end pb-0">
                    {{ recipe.name }}
                  </v-col>
                  <v-col sm="6" md="3" v-if="recipe.satisfaction">
                    <v-row class="d-flex align-end text-caption pl-1 mt-0">
                      Satisfaction
                    </v-row>
                    <v-row class="mt-1">
                      <v-rating
                        v-if="recipe.satisfaction"
                        :model-value="recipe.satisfaction / 2"
                        :length="5"
                        active-color="primary"
                        size="small"
                        density="compact"
                        readonly
                        half-increments/>
                    </v-row>
                  </v-col>
                  <v-col sm="6" md="3" v-if="recipe.difficulty">
                    <v-row class="d-flex align-end text-caption pl-1 mt-0">
                      Difficulty
                    </v-row>
                    <v-row class="mt-1">
                      <v-rating
                        v-if="recipe.difficulty"
                        :model-value="recipe.difficulty / 2"
                        :length="5"
                        active-color="primary"
                        size="small"
                        density="compact"
                        readonly
                        half-increments/>
                    </v-row>
                  </v-col>
                </v-row>
                <v-spacer />
                <v-row>
                  <v-col cols="12">
                    <v-chip
                      v-for="(tag, tagIdx) in recipe.tags"
                      :key="`recipe-tag-${tagIdx}`"
                      :text="capitalise(tag)"
                      :color="tagColor(tag)"
                      class="mr-1 mt-1"
                      variant="flat"
                      size="small" />
                  </v-col>
                </v-row>
                <v-row v-if="recipe.description">
                  {{ recipe.description }}
                </v-row>
              </v-col>
              <v-col sm="12" md="4">
                <v-skeleton-loader type="image" boilerplate />
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <!-- TOOLS -->
    <v-row v-if="!recipeLoading && tools.length" class="mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-chip
                  v-for="(tool, toolIdx) in tools"
                  :key="`tool-${toolIdx}`"
                  :text="tool.tool"
                  :prepend-icon="tool.icon"
                  class="mr-1"
                  size="x-large"
                  label />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2" v-if="!recipeLoading">
      <!-- INGREDIENTS -->
      <v-col md="4" sm="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" class="d-flex align-center">
                Ingredients
                <v-spacer />
                <v-btn
                  :color="ingredientsCombined ? 'primary' : null"
                  variant="flat"
                  size="x-small"
                  icon="mdi-select-group"
                  @click="ingredientsCombined = !ingredientsCombined" />
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row
              v-for="(section, sectionIdx) in ingredients"
              :key="`ingredient-section-${sectionIdx}`">
              <v-col cols="12">
                <v-row v-if="section.section">
                  <v-col cols="12" class="pb-0 text-subtitle-1">
                    {{ capitalise(section.section) }}
                    <v-divider />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div
                      v-for="ingredient in section.ingredients"
                      :key="`ingredient-${ingredient.key}`">
                      {{ ingredient.description }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- INSTRUCTIONS -->
      <v-col md="8" sm="12">
        <v-card
          v-for="(section, sectionIdx) in recipe.recipe"
          :key="`instruction-section-${sectionIdx}`"
          class="mb-2">
          <v-card-title>
            {{ capitalise(section.section) }}
          </v-card-title>
          <v-card-text>
            <ol class="pl-4">
              <li
                v-for="(instruction, itemIdx) in section.instructions"
                :key="`${section.section}-instruction-${itemIdx}`">
                {{ instruction }}
              </li>
            </ol>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { capitalise, decimalToFraction, tagColor } from '@/utils';

import { useRecipeStore } from '../stores';

const route = useRoute();
const recipeStore = useRecipeStore();
const { item: getRecipe, itemLoading: getRecipeLoading } = storeToRefs(recipeStore);

const recipe = computed(() => getRecipe.value(route.params.id));
const recipeLoading = computed(() => getRecipeLoading.value(route.params.id));

const tools = computed(() => {
  if (!recipe.value || !recipe.value.recipe) return [];

  const getToolIcon = (tool) => {
    if (['pot', 'pan'].includes(tool)) return 'mdi-pot-steam';
    if (['oven', 'stove'].includes(tool)) return 'mdi-stove';
    if (tool === 'slow-cooker') return 'mdi-pot';
    if (tool === 'microwave') return 'mdi-microwave';
    if (tool === 'brush') return 'mdi-brush';
    if (tool.includes('knife')) return 'mdi-knife';
    if (tool.includes('bowl')) return 'mdi-bowl-mix';
    if (tool.includes('cup')) return 'mdi-cup';

    console.warn(`Unknown tool icon: ${tool}`);
    return '';
  };

  return recipe.value.recipe
    .map(({ tools }) => tools)
    .flat()
    .map((tool) => ({ tool: capitalise(tool), icon: getToolIcon(tool.toLowerCase() )}));
});

const ingredientsCombined = ref(false);

const ingredientDescription = ({ item, quantity, unit }) => {
  let str = `${decimalToFraction(quantity, true)} `;
  if (unit) {
    str += unit;
    if (quantity > 1) str += 's';
    str += ' of ';
  }
  str += item;
  if (!unit && quantity > 1) str += 's';
  return str;
};

const ingredients = computed(() => {
  if (!recipe.value || !recipe.value.recipe) return [];
  if (!ingredientsCombined.value) return recipe.value.recipe.map(({ section, ingredients }) => ({
    section,
    ingredients: ingredients.map((item, idx) => ({
      ...item,
      key: `${item.item}-${idx}`,
      description: ingredientDescription(item),
    })),
  }));

  const reducedList = recipe.value.recipe.reduce((acc, { ingredients }) => {
    ingredients.forEach((ingredient) => {
      const key = `${ingredient.item}-${ingredient.unit}`;
      if (!(key in acc)) acc[key] = { ...ingredient, quantity: 0 };
      acc[key].quantity += ingredient.quantity;
    });
    return acc;
  }, {});

  return [{
    ingredients: Object.entries(reducedList).map(([key, item]) => ({
      ...item,
      key,
      description: ingredientDescription(item),
    })),
  }];
});

onMounted(async () => {
  try {
    await recipeStore.getDetail(route.params.id);
  } catch (err) {
    console.warn(`Failed to load recipe ${route.params.id}`, err);
    useRouter().push({ name: 'recipe-book' });
  }
});
</script>
