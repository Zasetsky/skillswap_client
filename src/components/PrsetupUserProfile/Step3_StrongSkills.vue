<template>
  <div class="step3-strong-skills">
    <h3 class="title">Сильные стороны</h3>
    <v-form class="form" ref="form">
      <template v-if="!selectedTheme">
        <theme-buttons
          @selected-theme="selectTheme"
        />
      </template>
      <template v-else>
        <navigation-container
          :selectedTheme="selectedTheme"
          :selectedCategory="selectedCategory"
          :selectedSubcategory="selectedSubcategory"
          @resetThemeCategorySubCategory="resetThemeCategorySubCategory"
          @resetCategorySubCategory="resetCategorySubCategory"
          @resetSubCategory="resetSubCategory"
        />
        <template v-if="!selectedCategory">
          <category-buttons
            :categories="selectedTheme.categories"
            @category-selected="selectCategory"
          />
        </template>
        <template v-else>
          <template v-if="!selectedSubcategory">
            <subcategory-buttons
              :subcategories="selectedCategory.subcategories"
              @subcategory-selected="selectSubcategory"
            />
          </template>
          <template v-else>
            <skill-chips
              :skills="selectedSubcategory.skills"
              :selectedSkills="strongSkills"
              @skillToggled="toggleSkill"
            />
          </template>
        </template>
      </template>
      <selected-skills
        :selectedSkills="strongSkills"
        @remove-skill="removeSkill"
      />
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
import ThemeButtons from "./Step3/ThemeButtons.vue";
import NavigationContainer from "./Step3/NavigationContainer.vue";
import CategoryButtons from "./Step3/CategoryButtons.vue";
import SubcategoryButtons from "./Step3/SubcategoryButtons.vue";
import SkillChips from "./Step3/SkillChips.vue";
import SelectedSkills from "./Step3/SelectedSkills.vue";

import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ThemeButtons,
    NavigationContainer,
    CategoryButtons,
    SubcategoryButtons,
    SkillChips,
    SelectedSkills
  },

  computed: {
    ...mapGetters('skills', ['getSkillList']),
  },


  data() {
    return {
      strongSkills: [],
      selectedTheme: null,
      selectedCategory: null,
      selectedSubcategory: null,
      minSkillsRequired: 1,
      };
  },


  methods: {
    ...mapActions('skills', ['fetchAvailableSkills', 'addStrongSkills']),

    selectTheme(theme) {
      this.selectedTheme = theme;
    },

    resetThemeCategorySubCategory() {
      this.selectedTheme = null;
      this.selectedCategory = null;
      this.selectedSubcategory = null;
    },

    resetCategorySubCategory() {
      this.selectedCategory = null;
      this.selectedSubcategory = null;
    },

    resetSubCategory() {
      this.selectedSubcategory = null;
    },

    findSkillId(skill) {
      const skillItem = this.getSkillList.find(
        (s) =>
          s.theme === this.selectedTheme.theme &&
          s.category === this.selectedCategory.category &&
          s.subcategory === this.selectedSubcategory.subcategory &&
          s.skill === skill
      );
      return skillItem ? skillItem._id : null;
    },

    removeSkill(index) {
      this.strongSkills.splice(index, 1);
    },

    selectCategory(category) {
      this.selectedCategory = category;
    },

    selectSubcategory(subcategory) {
      this.selectedSubcategory = subcategory;
    },

    isSkillSelected(skill) {
      return this.strongSkills.some(
        (s) =>
          s.theme === this.selectedTheme.theme &&
          s.category === this.selectedCategory.category &&
          s.subcategory === this.selectedSubcategory.subcategory &&
          s.skill === skill
      );
    },

    toggleSkill(skill) {
      const skillId = this.findSkillId(skill);

      const selectedSkill = {
        _id: skillId,
        theme: this.selectedTheme.theme,
        category: this.selectedCategory.category,
        subcategory: this.selectedSubcategory.subcategory,
        skill        
      };

      const index = this.strongSkills.findIndex(
        (s) =>
          s.theme === selectedSkill.theme &&
          s.category === selectedSkill.category &&
          s.subcategory === selectedSkill.subcategory &&
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
      this.selectedSubcategory = null;
    },

    async goToNextStep() {
      if (this.strongSkills.length >= this.minSkillsRequired) {
        await this.addStrongSkills(this.strongSkills);
        this.$emit("go-to-next-step");
      }
    },
  },

  mounted() {
    this.fetchAvailableSkills();
  },
};
</script>

<style lang="scss">
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
