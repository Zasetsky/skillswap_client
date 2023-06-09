<template>
  <div class="skills-kit">
    <h3 v-if="skillKit === 'Strong'" class="title">Сильные стороны</h3>
    <h3 v-if="skillKit === 'Weak'" class="title">Слабые стороны</h3>
    <v-form class="form" ref="form">
      <template v-if="!selectedTheme">
        <theme-buttons
          :disabled="isSkillLimitReached"
          @selected-theme="selectTheme"
        />
      </template>
      <template v-else>
        <navigation-container
          :selectedTheme="selectedTheme"
          :selectedCategory="selectedCategory"
          :selectedSubcategory="selectedSubcategory"
          @resetThemeCategorySubcategory="resetThemeCategorySubcategory"
          @resetCategorySubcategory="resetCategorySubcategory"
          @resetSubcategory="resetSubcategory"
        />
        <template v-if="!selectedCategory">
          <category-buttons
            :disabled="isSkillLimitReached"
            :categories="selectedTheme.categories"
            @category-selected="selectCategory"
          />
        </template>
        <template v-else>
          <template v-if="!selectedSubcategory">
            <subcategory-buttons
              :disabled="isSkillLimitReached"
              :subcategories="selectedCategory.subcategories"
              @subcategory-selected="selectSubcategory"
            />
          </template>
          <template v-else>
            <skill-chips
              :disabled="isSkillLimitReached"
              :skills="selectedSubcategory.skills"
              :selectedSkills="skills"
              @skillToggled="toggleSkill"
            />
          </template>
        </template>
      </template>
      <selected-skills
        :selectedSkills="skills"
        @remove-skill="removeSkill"
      />

      <confirmation-dialog
        v-model="showModal"
        :disabled="skills.length < minSkillsRequired || !allSkillsHaveLevel"
        @open-window="checkSkillsAndProceed"
        @go-to-next-step="goToNextStep"
      />
      <div v-if="skills.length < minSkillsRequired" class="error-message">
        Выберите хотя бы 1 навык
      </div>

      <div v-if="!allSkillsHaveLevel && skills.length > 0 && skillKit === 'Strong'" class="error-message">
        Выберите какой уровень владения навыком вы ожидаете от партнёра, которому будете преподавать
      </div>
      <div v-if="!allSkillsHaveLevel && skills.length > 0 && skillKit === 'Weak'" class="error-message">
        Выберите свой уровень владения навыком, который хотите изучить
      </div>
    </v-form>
  </div>
</template>

<script>
import ThemeButtons from "./SkillsParts/ThemeButtons.vue";
import NavigationContainer from "./SkillsParts/NavigationContainer.vue";
import CategoryButtons from "./SkillsParts/CategoryButtons.vue";
import SubcategoryButtons from "./SkillsParts/SubcategoryButtons.vue";
import SkillChips from "./SkillsParts/SkillChips.vue";
import SelectedSkills from "./SkillsParts/SelectedSkills.vue";
import ConfirmationDialog  from "./SkillsParts/ConfirmationDialog.vue";

import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ThemeButtons,
    NavigationContainer,
    CategoryButtons,
    SubcategoryButtons,
    SkillChips,
    SelectedSkills,
    ConfirmationDialog 
  },

  props: {
    skillKit: String
  },

  data() {
    return {
      selectedTheme: null,
      selectedCategory: null,
      selectedSubcategory: null,
      minSkillsRequired: 1,
      showModal: false,
      skills: [],
      };
  },

  computed: {
    ...mapGetters('skills', ['getSkillList']),
    ...mapGetters("auth", ["currentUser"]),

    maxSkillsAllowed() {
      return this.currentUser && this.currentUser.vip ? 9 : 3;
    },

    allSkillsHaveLevel() {
      return this.skills.length > 0 && this.skills.every(skill => skill.level !== null);
    },

    isSkillLimitReached() {
      return this.skills.length >= this.maxSkillsAllowed;
    }
  },

  methods: {
    ...mapActions('skills', ['fetchAvailableSkills', 'addStrongSkills', 'addWeakSkills']),
    ...mapActions('user', ['isPreSetupToggle', 'fetchCurrentUser']),

    selectTheme(theme) {
      this.selectedTheme = theme;
    },

    resetThemeCategorySubcategory() {
      this.selectedTheme = null;
      this.selectedCategory = null;
      this.selectedSubcategory = null;
    },

    resetCategorySubcategory() {
      this.selectedCategory = null;
      this.selectedSubcategory = null;
    },

    resetSubcategory() {
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
      this.skills.splice(index, 1);
    },

    selectCategory(category) {
      this.selectedCategory = category;
    },

    selectSubcategory(subcategory) {
      this.selectedSubcategory = subcategory;
    },

    isSkillSelected(skill) {
      return this.skills.some(
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
        skill,
        level: null
      };

      const index = this.skills.findIndex(
        (s) =>
          s.theme === selectedSkill.theme &&
          s.category === selectedSkill.category &&
          s.subcategory === selectedSkill.subcategory &&
          s.skill === selectedSkill.skill
      );

      if (index === -1) {
        this.skills.push(selectedSkill);
      } else {
        this.skills.splice(index, 1);
      }

      this.selectedTheme = null;
      this.selectedCategory = null;
      this.selectedSubcategory = null;
    },

    checkSkillsAndProceed() {
      if (this.skills.length >= this.minSkillsRequired && this.skills.length < this.maxSkillsAllowed) {
        this.showModal = true;
      } else {
        this.goToNextStep();
      }
    },

    async goToNextStep() {
      if (!this.allSkillsHaveLevel) {
        return;
      }

      try {
        if (this.skillKit === 'Strong') {
          await this.addStrongSkills(this.skills);
          this.$emit("go-to-next-step");
        } else {
          await this.addWeakSkills(this.skills);
          await this.isPreSetupToggle();
          await this.fetchCurrentUser();

          localStorage.removeItem(`currentStep_${this.currentUser._id}`);
          this.$router.push('/home');
        }
      } catch (error) {
        console.error('Error:', error);
        // здесь вы можете добавить обработку ошибки, например, показать сообщение об ошибке пользователю
      }
    }
  },
 
  mounted() {
    this.fetchAvailableSkills();
  },
};
</script>

<style scoped lang="scss">
.skills-kit {
  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .form {
    margin-bottom: 1.5rem;
  }

  .error-message {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}
</style>
