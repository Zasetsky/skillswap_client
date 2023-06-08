<template>
  <div>
    <v-autocomplete
      :value="getSelectedSkill"
      :items="listSkillsToLearn"
      :item-text="item => item.skill"
      label="Выберите навык, который хотите улучшить"
      outlined
      return-object
      @input="onSkillChange"
    ></v-autocomplete>
    <v-btn color="primary" @click="findMatchingUsers">Найти</v-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
      ...mapGetters('auth', ['currentUser']),
      ...mapGetters('swapRequests', ['getSwapRequests']),
      ...mapGetters('matching', ['getSelectedSkill']),

      listSkillsToLearn() {
        const swapRequests = this.getSwapRequests;
        if (!swapRequests) return [];

        // Get skillsToLearn from all swapRequests
        const swapRequestsSkillsToLearn = swapRequests.reduce((acc, request) => {
          acc.push(...request.receiverData.skillsToLearn);
          return acc;
        }, []);

        return this.currentUser.skillsToLearn.filter(skillToLearn => {
          return !swapRequestsSkillsToLearn.some(skillInRequest =>
            JSON.stringify(skillToLearn) === JSON.stringify(skillInRequest)
          );
        });
      },

  },

  created() {
    if (this.$route.query.skillToLearnId) {
      const skillToLearnId = this.$route.query.skillToLearnId;
      const skillToLearn = this.currentUser.skillsToLearn.find(
        (skill) => skill._id === skillToLearnId
      );
      if (skillToLearn) {
        this.setSelectedSkill(skillToLearn);
        this.findMatchingUsers();
      }
    }
  },

  methods: {
    ...mapActions("matching", ["fetchMatchingUsers", "setSelectedSkill"]),

    async findMatchingUsers() {
      try {
        console.log(this.getSelectedSkill._id);
        await this.fetchMatchingUsers(this.getSelectedSkill._id);
        
      } catch (error) {
        console.error(error);
      }
    },

    onSkillChange(selectedSkill) {
      this.setSelectedSkill(selectedSkill);
    }
  },
};
</script>