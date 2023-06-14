<template>
  <div>
    <v-btn
        v-if="!isSwapRequestAlreadySent || isCurrentWeakSkillActive"
        :disabled="isCurrentWeakSkillActive"
        color="primary"
        @click="proposeSkillExchange"
      >
      Предложить обмен навыками
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    isSwapRequestAlreadySent: {
      type: Boolean,
      default: false
    },

    isCurrentWeakSkillActive: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    ...mapGetters("user", ["getUserProfile"]),
    ...mapGetters("auth", ["currentUser"]),

    myStrongSkillsForUser() {
      const mySkills = this.currentUser.skillsToTeach;
      const userSkills = this.getUserProfile.skillsToLearn || [];
      const skillsForUser = mySkills.filter(mySkill => {
        return userSkills.some(userSkill => {
          return mySkill._id === userSkill._id;
        });
      });

      return skillsForUser;
    },

    mySkillToLearn() {
      return this.currentUser.skillsToLearn.find(skill => skill._id === this.$route.query.skillToLearnId) || {};
    },
  },

  methods: {
    ...mapActions("swapRequests", ["sendSwapRequest"]),

    async proposeSkillExchange() {
      const senderData = {
        avatar: this.currentUser.avatar,
        firstname: this.currentUser.firstname,
        lastname: this.currentUser.lastname,
        bio: this.currentUser.bio,
        skillsToLearn: this.mySkillToLearn,
        skillsToTeach: this.myStrongSkillsForUser,
      };
      const receiverData = {
        avatar: this.getUserProfile.avatar,
        firstname: this.getUserProfile.firstname,
        lastname: this.getUserProfile.lastname,
        bio: this.getUserProfile.bio,
        skillsToLearn: this.mySkillToLearn,
      };
      try {
        await this.sendSwapRequest({ senderId: this.currentUser._id, receiverId: this.getUserProfile._id, senderData, receiverData });

        this.$router.push({ 
          name: "WeakSkillsPage", 
          query: { weakSkillId: this.mySkillToLearn._id } 
        });
      }
      catch (error) {
        console.error("Error creating swap request:", error);
      }
    },
  }
}
</script>
<style lang="">
  
</style>