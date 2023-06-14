<template>
  <div>
    <v-btn
      class="grey lighten-2"
      v-if="isSwapRequestAlreadySent && !isCurrentWeakSkillActive"
      @click="cancelSwapRequest"
    >
      <v-hover>
        <template v-slot:default="{ hover }">
          <span style="min-width: 286px;">{{ hover ? 'Отменить запрос' : 'Вы уже предложили этот навык' }}</span>
        </template>
      </v-hover>
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
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("user", ["getUserProfile"]),

    swapRequestId() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return "";
      }
      const request = this.getSwapRequests.find((request) => request.senderId === this.getUserProfile._id ||
        request.receiverId === this.getUserProfile._id);
      return request ? request._id : "";
    },
  },

  methods: {
    ...mapActions("swapRequests", ["deleteSwapRequest"]),

    async cancelSwapRequest() {
      try {
        await this.deleteSwapRequest(this.swapRequestId);
      }
      catch (error) {
        console.error("Error creating swap request:", error);
      }
    },
  },
}
</script>