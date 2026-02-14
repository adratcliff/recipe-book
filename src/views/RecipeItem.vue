<template>
  <v-container>
    <v-card v-if="recipeLoading" border flat>
      <v-skeleton-loader type="image, article, chip@3" />
    </v-card>

    <div v-if="!recipeLoading">
      <!-- HEADER -->
      <v-row>
        <v-col cols="12">
          <v-card border flat class="overflow-hidden">
            <v-row no-gutters>
              <v-col cols="12" md="8" class="pa-6">
                <div class="d-flex flex-column h-100">
                  <h1 class="text-h4 font-weight-bold mb-2">{{ recipe.name }}</h1>

                  <div class="d-flex align-center flex-wrap ga-4 mb-4">
                    <div v-if="recipe.satisfaction">
                      <div class="text-caption text-medium-emphasis">Satisfaction</div>
                      <v-rating
                        :model-value="recipe.satisfaction / 2"
                        active-color="amber"
                        size="small"
                        density="compact"
                        readonly
                        half-increments />
                    </div>

                    <div v-if="recipe.difficulty">
                      <div class="text-caption text-medium-emphasis">Difficulty</div>
                      <v-rating
                        :model-value="recipe.difficulty / 2"
                        active-color="red-lighten-1"
                        size="small"
                        density="compact"
                        readonly
                        half-increments />
                    </div>
                  </div>

                  <p v-if="recipe.description" class="text-body-1 text-medium-emphasis mb-4">{{ recipe.description }}</p>

                  <div class="mt-auto">
                    <v-chip
                      v-for="(tag, idx) in recipe.tags"
                      :key="idx"
                      :color="tagColor(tag)"
                      :text="capitalise(tag)"
                      size="small"
                      variant="tonal"
                      class="mr-2 mb-2" />
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <v-img
                  cover
                  height="100%"
                  min-height="250"
                  src=""
                  class="bg-grey-lighten-2">
                  <template #placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey-lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!-- HEADER -->

      <!-- TOOLS -->
      <v-row v-if="tools.length" class="mt-2">
        <v-col cols="12">
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="(tool, idx) in tools"
              :key="idx"
              :text="tool.tool"
              :prepend-icon="tool.icon"
              variant="outlined"
              color="secondary"
              label />
          </div>
        </v-col>
      </v-row>
      <!-- TOOLS -->

      <v-row class="mt-4">
        <!-- INGREDIENTS -->
        <v-col cols="12" lg="4">
          <v-card border flat>
            <v-toolbar color="transparent" density="compact">
              <v-toolbar-title class="text-h6">Ingredients</v-toolbar-title>
              <v-spacer />
              <v-menu location="bottom">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :text="multiplier.toString() + ' x'"
                    variant="tonal"
                    size="small"
                    color="primary"
                    class="mr-2" />
                </template>
                <v-list density="compact">
                  <v-list-item
                    v-for="opt in scaleOptions"
                    :key="opt"
                    :active="multiplier === opt"
                    @click="multiplier = opt">
                    <v-list-item-title>{{ opt }}x</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip text="Copy Shopping List" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-content-copy"
                    variant="text"
                    size="small"
                    class="mr-2"
                    @click="shareShoppingList" />
                </template>
              </v-tooltip>
              <v-tooltip text="Combine Ingredients" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :color="ingredientsCombined ? 'primary' : undefined"
                    :variant="ingredientsCombined ? 'flat' : 'text'"
                    icon="mdi-select-group"
                    size="small"
                    @click="ingredientsCombined = !ingredientsCombined" />
                  </template>
              </v-tooltip>
            </v-toolbar>

            <v-divider />

            <v-list class="pa-0">
              <template v-for="(section, sIdx) in ingredients" :key="sIdx">
                <v-list-subheader v-if="section.section" class="font-weight-black text-uppercase">{{ capitalise(section.section) }}</v-list-subheader>

                <v-list-item
                  v-for="(ing, iIdx) in section.ingredients"
                  :key="iIdx"
                  min-height="40">
                  <template #prepend>
                    <v-checkbox-btn density="compact" color="primary" />
                  </template>
                  <v-list-item-title class="text-body-2 text-wrap">{{ ing.description }}</v-list-item-title>
                </v-list-item>
                <v-divider v-if="sIdx < ingredients.length - 1" />
              </template>
            </v-list>
          </v-card>
        </v-col>
        <!-- INGREDIENTS -->

        <!-- INSTRUCTIONS -->
        <v-col lg="8" cols="12">
          <div
            v-for="(section, sIdx) in recipe.recipe"
            :key="sIdx"
            class="mb-10">
            <div class="d-flex align-center mb-6">
              <h2 class="text-h5 font-weight-black text-uppercase tracking-widest">
                {{ capitalise(section.section) }}
              </h2>
              <v-divider class="ml-4" thickness="2" />
            </div>

            <div class="instruction-timeline">
              <v-card
                v-for="(instruction, itemIdx) in section.instructions"
                :class="{ 'active-step': currentStep === `${sIdx}-${itemIdx}` }"
                :key="itemIdx"
                flat
                border
                rounded="lg"
                class="mb-4 instruction-step"
                @click="selectStep(`${sIdx}-${itemIdx}`)">
                <div class="d-flex align-center pa-4">
                  <div class="step-number-container mr-4">
                    <span class="text-h4 font-weight-black text-primary opacity-20">
                      {{ itemIdx + 1 }}
                    </span>
                  </div>

                  <div class="flex-grow-1">
                    <div class="text-body-1 font-weight-medium mb-1" style="line-height: 1.6;">
                      {{ instruction }}
                    </div>
                  </div>

                  <div>
                    <v-checkbox-btn color="success" />
                  </div>
                </div>
              </v-card>
            </div>
          </div>
        </v-col>
        <!-- INSTRUCTIONS -->
      </v-row>
    </div>
  </v-container>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import {
  capitalise,
  decimalToFraction,
  handleError,
  tagColor,
} from 'shared/utils';

import { useRecipeStore } from '../stores';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const { item: getRecipe, itemLoading: getRecipeLoading } = storeToRefs(recipeStore);

const recipe = computed(() => getRecipe.value(route.params.id));
const recipeLoading = computed(() => getRecipeLoading.value(route.params.id));

const tools = computed(() => {
  if (!recipe.value || !recipe.value.recipe) return [];

  const getToolIcon = (toolName) => {
    if (!toolName) return 'mdi-tools';

    const tool = toolName.toLowerCase().trim();

    if (['pot', 'pan'].includes(tool)) return 'mdi-pot-steam';
    if (['oven', 'stove'].includes(tool)) return 'mdi-stove';
    if (tool === 'slow-cooker') return 'mdi-pot';
    if (tool === 'microwave') return 'mdi-microwave';
    if (tool === 'brush') return 'mdi-brush';

    if (tool.includes('knife')) return 'mdi-knife';
    if (tool.includes('bowl')) return 'mdi-bowl-mix';
    if (tool.includes('cup')) return 'mdi-cup';
    if (tool.includes('blender') || tool.includes('processor')) return 'mdi-blender-outline';
    if (tool.includes('scale')) return 'mdi-scale-balanced';
    if (tool.includes('air fryer')) return 'mdi-wind-power';
    if (tool.includes('fridge') || tool.includes('chill')) return 'mdi-fridge-outline';
    if (tool.includes('whisk')) return 'mdi-restore';

    console.warn(`Unknown tool icon: ${tool}`);
    return 'mdi-tools';
  };

  return recipe.value.recipe
    .map(({ tools }) => tools)
    .flat()
    .map((tool) => ({ tool: capitalise(tool), icon: getToolIcon(tool) }));
});

const currentStep = ref(null);
const selectStep = (key) => {
  currentStep.value = currentStep.value === key ? null : key;
};

const ingredientsCombined = ref(false);
const multiplier = ref(1);
const scaleOptions = [0.5, 1, 2, 3];

const ingredientDescription = ({ item, quantity, unit }) => {
  const amount = quantity * multiplier.value;
  let str = `${decimalToFraction(amount, true)} `;
  if (unit) {
    str += unit;
    if (amount > 1) str += 's';
    str += ' of ';
  }
  str += item;
  if (!unit && amount > 1) str += 's';
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

const shareShoppingList = async () => {
  let listText = `🛒 Shopping List: ${recipe.value.name}\n`

  ingredients.value.forEach(section => {
    if (section.section) {
      listText += `\n--- ${section.section.toUpperCase()} ---\n`
    }
    listText += section.ingredients.map(ingredient => ingredient.description).join('\n');
  });

  if (navigator.share) {
    await navigator.share({
      title: 'Shopping List',
      text: listText,
    })
  } else {
    navigator.clipboard.writeText(listText)
  }
};

onMounted(async () => {
  try {
    await recipeStore.getDetail(route.params.id);
    if (!recipe.value.id) {
      return router.push({ name: 'recipe-book' });
    }
  } catch (err) {
    handleError(`Failed to load recipe ${route.params.id}`, err);
    router.push({ name: 'recipe-book' });
  }
});
</script>

<style scoped>
.instruction-step {
  transition: all 0.3s ease;
  border-color: rgba(var(--v-border-color), 0.12) !important;
}

.instruction-step:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.active-step {
  border-left: 6px solid rgb(var(--v-theme-primary)) !important;
  transform: translateX(8px);
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.step-number-container {
  min-width: 40px;
  display: flex;
  justify-content: center;
  user-select: none;
}

.opacity-20 {
  opacity: 0.2;
}

.tracking-widest {
  letter-spacing: 0.15em !important;
}
</style>