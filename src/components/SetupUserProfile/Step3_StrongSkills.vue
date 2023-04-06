<template>
  <div class="step3-strong-skills">
    <h3 class="title">Сильные стороны</h3>
    <v-form class="form" ref="form">
      <template v-if="!selectedTheme">
        <div class="theme-buttons" v-for="(theme, themeIndex) in groupedSkills" :key="themeIndex">
          <v-btn class="theme-button" @click="selectTheme(theme)">{{ theme.theme }}</v-btn>
        </div>
      </template>
      <template v-else>
        <v-container class="navigation-container">
          <v-row>
            <v-btn class="navigation-button" outlined color="primary" @click="selectedTheme = null; selectedCategory = null; selectedSubCategory = null">
              <v-icon left>mdi-arrow-left</v-icon>
              {{ selectedTheme.theme }}
            </v-btn>
            <v-btn v-if="selectedCategory" class="navigation-button" outlined color="primary" @click="selectedCategory = null; selectedSubCategory = null">
              <v-icon left>mdi-arrow-left</v-icon>
              {{ selectedCategory.category }}
            </v-btn>
            <v-btn v-if="selectedSubCategory" class="navigation-button" outlined color="primary" @click="selectedSubCategory = null">
              <v-icon left>mdi-arrow-left</v-icon>
              {{ selectedSubCategory.subCategory }}
            </v-btn>
          </v-row>
        </v-container>
        <template v-if="!selectedCategory">
          <div class="category-buttons" v-for="(category, categoryIndex) in selectedTheme.categories" :key="categoryIndex">
            <v-btn class="category-button" @click="selectCategory(category); selectedSubCategory = null">{{ category.category }}</v-btn>
          </div>
        </template>
        <template v-else>
          <template v-if="!selectedSubCategory">
            <div class="subcategory-buttons" v-for="(subCategory, subCategoryIndex) in selectedCategory.subCategories" :key="subCategoryIndex">
              <v-btn class="subcategory-button" @click="selectSubCategory(subCategory)">{{ subCategory.subCategory }}</v-btn>
            </div>
          </template>
          <template v-else>
            <div class="skill-chips" v-for="(skill, skillIndex) in selectedSubCategory.skills" :key="skillIndex">
              <v-chip :input-value="isSkillSelected(skill)" @click="toggleSkill(skill)">{{ skill }}</v-chip>
            </div>
          </template>
        </template>
      </template>
      <div v-if="strongSkills.length > 0" class="selected-skills">
        <h4>Выбранные навыки:</h4>
        <v-btn v-for="(strongSkill, index) in strongSkills" :key="index" text @click="removeSkill(index)">
          <template v-if="strongSkill.theme !== 'Языки'">
            {{ strongSkill.subCategory }} - {{ strongSkill.skill }}
          </template>
          <template v-else>
            {{ strongSkill.theme }} - {{ strongSkill.category }}
          </template>
        </v-btn>
      </div>
      <v-btn
        class="next-button"
        color="primary"
        @click="goToNextStep"
        :disabled="strongSkills.length < minSkillsRequired"
      >
        Далее
      </v-btn>
      <div v-if="strongSkills.length < minSkillsRequired" class="error-message">
      Выберите хотя бы 1 навык
    </div>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "Step3_StrongSkills",

  computed: {
    ...mapGetters(['getSkillList']),
    groupedSkills() {
      return this.groupSkills(this.getSkillList);
    },
  },


  data() {
    return {
      strongSkills: [],
      selectedTheme: null,
      selectedCategory: null,
      selectedSubCategory: null,
      minSkillsRequired: 1,
      };
  },


  methods: {
    ...mapActions(['fetchAvailableSkills', 'addStrongSkills']),

    selectTheme(theme) {
      this.selectedTheme = theme;
    },

    removeSkill(index) {
      this.strongSkills.splice(index, 1);
    },

    selectCategory(category) {
      this.selectedCategory = category;
    },
    selectSubCategory(subCategory) {
      this.selectedSubCategory = subCategory;
    },
    isSkillSelected(skill) {
      return this.strongSkills.some(
        (s) =>
          s.theme === this.selectedTheme.theme &&
          s.category === this.selectedCategory.category &&
          s.subCategory === this.selectedSubCategory.subCategory &&
          s.skill === skill
      );
    },
    toggleSkill(skill) {
      const selectedSkill = {
        theme: this.selectedTheme.theme,
        category: this.selectedCategory.category,
        subCategory: this.selectedSubCategory.subCategory,
        skill,
      };

      const index = this.strongSkills.findIndex(
        (s) =>
          s.theme === selectedSkill.theme &&
          s.category === selectedSkill.category &&
          s.subCategory === selectedSkill.subCategory &&
          s.skill === selectedSkill.skill
      );

      if (index === -1) {
        this.strongSkills.push(selectedSkill);
      } else {
        this.strongSkills.splice(index, 1);
      }
      console.log(this.strongSkills);
      this.selectedTheme = null;
      this.selectedCategory = null;
      this.selectedSubCategory = null;
    },

    async goToNextStep() {
      if (this.strongSkills.length >= this.minSkillsRequired) {
        await this.addStrongSkills(this.strongSkills);
        this.$emit("go-to-next-step");
      }
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
            subCategories: [],
          };
          themeItem.categories.push(categoryItem);
        }

        let subCategoryItem = categoryItem.subCategories.find((item) => item.subCategory === skillItem.subCategory);

        if (!subCategoryItem) {
          subCategoryItem = {
            subCategory: skillItem.subCategory,
            skills: [],
          };
          categoryItem.subCategories.push(subCategoryItem);
        }

        subCategoryItem.skills.push(skillItem.skill);
      });

      return grouped;
    },
},


  mounted() {
    this.fetchAvailableSkills();
  },
};
</script>

<style scoped lang="scss">
.step3-strong-skills {
  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .form {
    margin-bottom: 1.5rem;
  }

  .theme-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .theme-button {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
    }
  }

  .category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .category-button {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
    }
  }

  .subcategory-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .subcategory-button {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
    }
  }

  .skill-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .v-chip {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
    }
  }

  .selected-skills {
    margin-bottom: 1.5rem;

    h4 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    v-btn {
      font-size: 1.5rem;
      margin-right: 1rem;
      margin-bottom: 1rem;
      text-transform: none;
    }
  }

  .next-button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    text-transform: none;
    max-width: 10rem;
  }

  .navigation-container {
    margin-bottom: 1.5rem;

    .navigation-button {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
      margin-right: 1rem;
    }
  }

  .error-message {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

@media (max-width: 767px) {
  .step3-strong-skills {
    .title {
      font-size: 1.5rem;
    }

    .theme-button, .category-button, .subcategory-button, .v-chip, .next-button, .navigation-button {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }

    .error-message {
      font-size: 1rem;
    }

    .navigation-container {
      .navigation-button {
        font-size: 1rem;
        padding: 0.5rem;
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
