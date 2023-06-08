<template>
  <div>
    <v-btn v-if="!isSwapRequestAlreadySent && !isSwapRequestReceived" color="primary" @click="proposeSkillExchange">
      Предложить обмен навыками
    </v-btn>
    <v-btn class="grey lighten-2" v-else-if="isSwapRequestAlreadySent" @click="cancelSwapRequest">
      <v-hover>
        <template v-slot:default="{ hover }">
          <span style="min-width: 286px;">{{ hover ? 'Отменить запрос' : 'Запрос на обмен уже отправлен' }}</span>
        </template>
      </v-hover>
    </v-btn>
    <v-btn class="grey lighten-2" v-else @click="cancelSwapRequest" style="min-width: 300px;">
      <v-hover>
        <template v-slot:default="{ hover }">
          <span style="min-width: 269px;">{{ hover ? 'Отклонить запрос' : 'Запрос на обмен уже получен' }}</span>
        </template>
      </v-hover>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters("user", ["getUserProfile"]),
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    myStrongSkillsForUser() {
      const mySkills = this.currentUser.skillsToTeach;
      const userSkills = this.getUserProfile.skillsToLearn || [];
      const skillsForUser = userSkills.filter(userSkill => {
        return mySkills.some(mySkill => {
          return mySkill._id === userSkill._id;
        });
      });
      return skillsForUser;
    },

    mySkillToLearn() {
      return this.currentUser.skillsToLearn.find(skill => skill._id === this.$route.query.skillToLearnId) || {};
    },

    isSwapRequestAlreadySent() {
      if (this.getSwapRequests || this.getSwapRequests.length !== 0) {
        return this.getSwapRequests.some((request) => request.receiverId === this.localUserId && (request.status === "pending" || request.status === "accepted"));
      }
      else {
        return false;
      }
    },

    isSwapRequestReceived() {
      if (this.getSwapRequests || this.getSwapRequests.length !== 0) {
        return this.getSwapRequests.some((request) => request.senderId === this.localUserId && (request.status === "pending" || request.status === "accepted"));
      }
      else {
        return false;
      }
    },

    swapRequestId() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return "";
      }
      const request = this.getSwapRequests.find((request) => request.senderId === this.localUserId ||
        request.receiverId === this.localUserId);
      return request ? request._id : "";
    },
  },

  methods: {
    ...mapActions("swapRequests", ["sendSwapRequest", "deleteSwapRequest"]),

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
        await this.sendSwapRequest({ senderId: this.currentUser._id, receiverId: this.localUserId, senderData, receiverData });

        localStorage.setItem("weakSkillId", this.mySkillToLearn._id);
        this.$router.push({ name: "WeakSkillsPage" });
      }
      catch (error) {
        console.error("Error creating swap request:", error);
      }
    },

    async cancelSwapRequest() {
      try {
        await this.deleteSwapRequest(this.swapRequestId);
      }
      catch (error) {
        console.error("Error creating swap request:", error);
      }
    }
  }
}
</script>
<style lang="">
  
</style>