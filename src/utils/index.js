export const getFoodTagCategoryIcon = (tags = []) => {
  const categories = {
    'dessert': 'mdi-cake-variant',
    'cake': 'mdi-cake',
    'breakfast': 'mdi-egg-fried',
    'lunch': 'mdi-food-fork-drink',
    'dinner': 'mdi-silverware-variant',
    'drink': 'mdi-glass-cocktail',
    'cocktail': 'mdi-glass-wine',
    'pasta': 'mdi-pasta',
    'pizza': 'mdi-pizza',
    'bread': 'mdi-baguette',
    'meat': 'mdi-food-steak',
    'fish': 'mdi-fish',
    'vegetarian': 'mdi-leaf',
    'vegan': 'mdi-leaf',
  };

  const foundTag = tags.find(tag => categories[tag.toLowerCase()]);
  return foundTag ? categories[foundTag.toLowerCase()] : 'mdi-silverware-fork-knife';
};

export const getToolIcon = (toolName) => {
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