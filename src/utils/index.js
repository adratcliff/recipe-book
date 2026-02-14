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