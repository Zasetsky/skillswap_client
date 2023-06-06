<template>
  <div>
    <div class="theme-buttons" v-for="(theme, themeIndex) in groupedSkills" :key="themeIndex">
      <v-btn class="theme-button" @click="selectTheme(theme)">{{ theme.theme }}</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    themes: Array,
  },

  computed: {
    ...mapGetters('skills', ['getSkillList']),

    groupedSkills() {
      return this.groupSkills(this.getSkillList);
    },
  },

  methods: {
    selectTheme(theme) {
      this.$emit('selected-theme', theme);
    },

    groupSkills() {
      const grouped = [];

      this.getSkillList.forEach((skillItem) => {
        let themeItem = grouped.find((item) => item.theme === skillItem.theme);

        if (!themeItem) {
          themeItem = {
            theme: skillItem.theme,
            categories: [],
          };
          grouped.push(themeItem);
        }

        let categoryItem = themeItem.categories.find((item) => item.category === skillItem.category);

        if (!categoryItem) {
          categoryItem = {
            category: skillItem.category,
            subcategories: [],
          };
          themeItem.categories.push(categoryItem);
        }

        let subcategoryItem = categoryItem.subcategories.find((item) => item.subcategory === skillItem.subcategory);

        if (!subcategoryItem) {
          subcategoryItem = {
            subcategory: skillItem.subcategory,
            skills: [],
          };
          categoryItem.subcategories.push(subcategoryItem);
        }

        subcategoryItem.skills.push(skillItem.skill);
      });

      return grouped;
    },
  }
};
</script>
