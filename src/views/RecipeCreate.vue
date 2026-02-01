<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="9" md="6">
            <v-text-field
              v-model="name"
              label="Recipe Name"
              hide-details />
          </v-col>
          <v-col cols="3" md="6" class="d-flex">
            <v-spacer />
            <v-btn
              text="Create"
              variant="outlined"
              color="primary"
              height="40"
              @click="createRecipe" />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="6">
            <div class="text-body-1 text-grey-lighten-1">Satisfaction</div>
            <v-rating
              label="Satisfcation"
              v-model="satisfaction"
              :length="5"
              active-color="primary"
              density="compact"
              half-increments
              hover />
          </v-col>
          <v-col md="6">
            <div class="text-body-1 text-grey-lighten-1">Difficulty</div>
            <v-rating
              v-model="difficulty"
              :length="5"
              active-color="primary"
              density="compact"
              half-increments
              hover />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="description"
              label="Description"
              hide-details />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox
              v-model="tags"
              :items="existingTags"
              :loading="!!recipeLoaders.list"
              label="Tags"
              multiple
              chips>
              <template #chip="{ item }">
                <v-chip
                  :text="capitalise(item.value)"
                  :color="tagColor(item.value.toLowerCase())" />
              </template>
            </v-combobox>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text
        v-for="(section, sIdx) in sections"
        :key="`section-input-${section.id}`"
        class="py-4">
        <v-row>
          <v-divider />
          <v-col cols="10" md="6">
            <v-text-field
              v-model="section.name"
              label="Name"
              hide-details />
          </v-col>
          <v-col cols="2" md="6" class="d-flex">
            <v-spacer />
            <v-btn
              :disabled="sections.length < 2"
              icon="mdi-delete"
              variant="outlined"
              color="error"
              size="small"
              @click="removeSection(section.id)" />
          </v-col>
        </v-row>
        <div v-if="section.name">
          <v-row
            v-for="(tool, tIdx) in section.tools"
            :key="`section-${section.id}-tool-${tIdx}`">
            <v-col cols="12" md="4" class="d-flex justify-space-between">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="section.tools[tIdx]"
                    ref="sectionTools"
                    label="Tool"
                    hide-details />
                </v-col>
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    @click="addSectionElement('tools', sIdx, tIdx)" />
                  <v-btn
                    :disabled="section.tools.length < 2"
                    icon="mdi-delete"
                    variant="outlined"
                    color="error"
                    size="x-small"
                    class="mx-2"
                    @click="removeSectionElement('tools', sIdx, tIdx)" />
                </div>
              </v-row>
            </v-col>
          </v-row>
          <v-row
            v-for="(ingredient, iIdx) in section.ingredients"
            :key="`section-${section.id}-ingredient-${iIdx}`">
            <v-col cols="12" md="8" class="d-flex justify-space-between">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="section.ingredients[iIdx].quantity"
                    ref="sectionIngredientQuantities"
                    label="Quantity"
                    type="number"
                    min="0"
                    hide-details />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="section.ingredients[iIdx].unit"
                    ref="sectionIngredientUnits"
                    label="Unit"
                    hide-details />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="section.ingredients[iIdx].item"
                    ref="sectionIngredientItems"
                    label="Item"
                    hide-details />
                </v-col>
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    @click="addSectionElement('ingredients', sIdx, iIdx)" />
                  <v-btn
                    :disabled="section.ingredients.length < 2"
                    icon="mdi-delete"
                    variant="outlined"
                    color="error"
                    size="x-small"
                    class="mx-2"
                    @click="removeSectionElement('ingredients', sIdx, iIdx)" />
                </div>
              </v-row>
            </v-col>
          </v-row>
          <v-row
            v-for="(instructions, iIdx) in section.instructions"
            :key="`section-${section.id}-instruction-${iIdx}`">
            <v-col cols="12" class="d-flex justify-space-between">
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="section.instructions[iIdx]"
                    ref="sectionInstructions"
                    label="Instruction"
                    rows="1"
                    auto-grow
                    hide-details />
                </v-col>
                <div class="mt-4">
                  <v-btn
                    icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    @click="addSectionElement('instructions', sIdx, iIdx)" />
                  <v-btn
                    :disabled="section.instructions.length < 2"
                    icon="mdi-delete"
                    variant="outlined"
                    color="error"
                    size="x-small"
                    class="mx-2"
                    @click="removeSectionElement('instructions', sIdx, iIdx)" />
                </div>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-row class="text-center">
          <v-divider />
          <v-col>
            <v-btn
              prepend-icon="mdi-plus"
              text="Add Section"
              variant="outlined"
              color="primary"
              @click="addSection" />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

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