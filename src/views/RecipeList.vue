<template>
  This is before component
  TEST
  This is after component
</template>

<script>
export default {
  name: 'RecipeBook',
  mounted() {
    setTimeout(() => {
      // this.$router.push({ name: 'recipe-item', params: { id: 'testid' } });
    }, 5000);
  },
};
</script>
