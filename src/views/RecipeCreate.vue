<template>
  <v-container class="max-width-container py-8">
    <v-form @submit.prevent="createRecipe">

      <div class="d-flex align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Create New Recipe</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Fill in the details below to share your masterpiece.</p>
        </div>
        <v-spacer />
        <v-btn
          color="primary"
          size="large"
          rounded="lg"
          elevation="2"
          prepend-icon="mdi-check"
          @click="createRecipe"
        >
          Create Recipe
        </v-btn>
      </div>

      <v-card border flat class="mb-6 rounded-xl pa-4">
        <v-card-title class="text-h6 pb-4">General Information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="name"
                label="Recipe Name"
                placeholder="e.g., Grandma's Secret Pasta"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6" md="2">
              <div class="text-caption text-grey mb-1">Satisfaction</div>
              <v-rating v-model="satisfaction" density="compact" color="amber" half-increments hover />
            </v-col>
            <v-col cols="6" md="2">
              <div class="text-caption text-grey mb-1">Difficulty</div>
              <v-rating v-model="difficulty" density="compact" color="red-lighten-1" half-increments hover />
            </v-col>

            <v-col cols="12" md="4" class="py-0">
              <v-switch
                v-model="isPublic"
                color="primary"
                label="Make Recipe Public"
                hide-details
                inset
              >
                <template #prepend>
                  <v-icon :icon="isPublic ? 'mdi-earth' : 'mdi-lock'" class="mr-2" />
                </template>
              </v-switch>
              <div class="text-caption text-medium-emphasis ml-10 mt-n2 mb-4">
                {{ isPublic ? 'Everyone can view this recipe' : 'Only you can view this recipe' }}
              </div>
            </v-col>

            <v-col cols="12" md="8">
              <v-combobox
                v-model="tags"
                :items="existingTags"
                label="Tags"
                multiple
                chips
                variant="outlined"
                closable-chips
              >
                <template #chip="{ item, props }">
                  <v-chip v-bind="props" :text="capitalise(item.value)" :color="tagColor(item.value.toLowerCase())" variant="flat" />
                </template>
              </v-combobox>
            </v-col>

            <v-col cols="12">
              <v-textarea v-model="description" label="Short Description" variant="outlined" rows="2" auto-grow />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div v-for="(section, sIdx) in sections" :key="section.id" class="mb-8">
        <v-card border flat class="rounded-xl overflow-hidden">
          <v-toolbar flat>
            <v-toolbar-title>
              <v-text-field
                v-model="section.name"
                placeholder="Section Name (e.g., The Dough)"
                variant="plain"
                hide-details
                class="font-weight-bold"
              />
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              v-if="sections.length > 1"
              icon="mdi-delete-outline"
              color="error"
              variant="text"
              @click="removeSection(section.id)"
            />
          </v-toolbar>

          <v-row no-gutters>
            <v-col cols="12" md="5" class="border-e pa-4">
              <div class="text-overline mb-4 text-primary">Ingredients & Tools</div>

              <div v-for="(tool, tIdx) in section.tools" :key="tIdx" class="d-flex ga-2 mb-2">
                <v-text-field
                  v-model="section.tools[tIdx]"
                  :prepend-inner-icon="getToolIcon(section.tools[tIdx])"
                  label="Tool"
                  ref="sectionTools"
                  variant="solo"
                  density="compact"
                  flat
                  hide-details />
                <v-btn
                  icon="mdi-plus"
                  variant="text"
                  size="small"
                  @click="addSectionElement('tools', sIdx, tIdx)" />
                <v-btn
                  :disabled="section.tools.length < 2"
                  icon="mdi-minus"
                  variant="text"
                  size="small"
                  color="error"
                  @click="removeSectionElement('tools', sIdx, tIdx)" />
              </div>

              <v-divider class="my-4" />

              <div v-for="(ing, iIdx) in section.ingredients" :key="iIdx" class="d-flex ga-1 mb-2 align-center">
                <v-text-field
                  v-model="ing.quantity"
                  ref="sectionIngredientQuantities"
                  label="Qty"
                  variant="solo"
                  density="compact"
                  flat
                  hide-details
                  style="width: 60px" />
                <v-text-field
                  v-model="ing.unit"
                  label="Unit"
                  variant="solo"
                  density="compact"
                  flat
                  hide-details
                  style="width: 80px" />
                <v-text-field
                  v-model="ing.item"
                  label="Item"
                  variant="solo"
                  density="compact"
                  flat
                  hide-details />
                <v-btn
                  icon="mdi-plus"
                  variant="text"
                  size="small"
                  @click="addSectionElement('ingredients', sIdx, iIdx)" />
                <v-btn
                  :disabled="section.ingredients.length < 2"
                  icon="mdi-minus"
                  variant="text"
                  size="small"
                  color="error"
                  @click="removeSectionElement('ingredients', sIdx, iIdx)" />
              </div>
            </v-col>

            <v-col cols="12" md="7" class="pa-4">
              <div class="text-overline mb-4 text-primary">Instructions</div>
              <div v-for="(inst, instIdx) in section.instructions" :key="instIdx" class="d-flex ga-3 mb-4">
                <v-avatar color="primary" size="24" class="mt-3 text-caption">{{ instIdx + 1 }}</v-avatar>
                <v-textarea
                  v-model="section.instructions[instIdx]"
                  ref="sectionInstructions"
                  variant="outlined"
                  density="compact"
                  rows="1"
                  auto-grow
                  hide-details
                  placeholder="What's the next step?" />
                <div class="d-flex flex-column">
                  <v-btn
                    icon="mdi-plus"
                    variant="text"
                    size="small"
                    @click="addSectionElement('instructions', sIdx, instIdx)" />
                  <v-btn
                    :disabled="section.instructions.length < 2"
                    icon="mdi-minus"
                    variant="text"
                    size="small"
                    color="error"
                    @click="removeSectionElement('instructions', sIdx, instIdx)" />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <v-btn
        block
        variant="outlined"
        height="80"
        color="primary"
        class="rounded-xl mb-12 dashed-border"
        prepend-icon="mdi-plus-circle"
        text="Add Another Section (e.g. Frosting, Garnish)"
        @click="addSection" />
    </v-form>
  </v-container>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { getToolIcon } from '@/utils';
import {
  capitalise,
  clone,
  handleError,
  randomHex,
  tagColor,
} from 'shared/utils';

import { useRecipeStore } from '../stores';

const router = useRouter();

const name = ref('');
const description = ref('');
const tags = ref([]);
const sections = ref([]);
const satisfaction = ref(0);
const difficulty = ref(0);
const isPublic = ref(false);

const recipeStore = useRecipeStore();
const { list: recipeList, loaders: recipeLoaders } = storeToRefs(recipeStore);

const existingTags = computed(() => [...new Set(recipeList.value.map(({ tags = [] }) => tags.map(capitalise)).flat())]);

const addSection = () => {
  sections.value.push({
    id: randomHex(4),
    name: '',
    ingredients: [{ quantity: '', unit: '', item: '' }],
    instructions: [''],
    tools: ['']
  });
};

const removeSection = (id) => {
  sections.value.splice(sections.value.findIndex(({ id: sectionId }) => sectionId === id), 1);
};

const sectionTools = ref([]);
const sectionIngredientQuantities = ref([]);
const sectionInstructions = ref([]);

const sectionElements = {
  tools: {
    property: 'tools',
    defaultValue: '',
    refList: sectionTools,
  },
  ingredients: {
    property: 'ingredients',
    defaultValue: { quantity: '', unit: '', item: '' },
    refList: sectionIngredientQuantities,
  },
  instructions: {
    property: 'instructions',
    defaultValue: '',
    refList: sectionInstructions,
  },
};

const addSectionElement = async (type, sIdx, eIdx) => {
  const {
    property,
    defaultValue,
    refList,
  } = sectionElements[type];

  sections.value[sIdx][property].splice(eIdx + 1, 0, clone(defaultValue));

  const refIdx = sections.value.slice(0, sIdx + 1).reduce((acc, cur, idx) => acc + (sIdx === idx ? eIdx + 2 : cur[property].length), 0);
  await nextTick();
  refList.value[refIdx - 1].focus();
};

const removeSectionElement = (type, sIdx, eIdx) => {
  sections.value[sIdx][sectionElements[type].property].splice(eIdx, 1);
};

const createRecipe = async () => {
  try {
    const id = await recipeStore.createDetail({
      name: name.value,
      description: description.value,
      tags: tags.value,
      difficulty: difficulty.value * 2,
      satisfaction: satisfaction.value * 2,
      times: {},
      public: isPublic.value,
      recipe: sections.value.reduce((acc, cur) => {
        if (!cur.name) return acc;
        const section = {
          section: cur.name,
          tools: cur.tools.map(el => el.trim()).filter(el => !!el),
          instructions: cur.instructions.map(el => el.trim()).filter(el => !!el),
          ingredients: cur.ingredients.map(el => {
            if (!el.quantity || !el.item) return null;
            return {
              quantity: Number(el.quantity.trim()),
              unit: el.unit.trim(),
              item: el.item.trim(),
            };
          }).filter(el => !!el),
        };
        if (section.tools.length || section.instructions.length || section.ingredients.length) acc.push(section);
        return acc;
      }, []),
    });

    if (!id) return;

    router.push({ name: 'recipe-item', params: { id } });
  } catch (err) {
    handleError('Failed to create recipe', err);
  }
};

onMounted(async () => {
  addSection();

  await recipeStore.getList();
});
</script>

<style scoped>
.max-width-container {
  max-width: 1000px;
  margin: 0 auto;
}

.dashed-border {
  border-style: dashed !important;
  border-width: 2px !important;
  /* Adjust background if you want a subtle tint */
  background-color: rgba(var(--v-theme-primary), 0.02);
}
</style>