<template>
  <div>
    <v-btn class="grey lighten-2" v-if="isSwapRequestAlreadySent" @click="cancelSwapRequest">
      <v-hover>
        <template v-slot:default="{ hover }">
          <span style="min-width: 286px;">{{ hover ? 'Отменить запрос' : 'Запрос на обмен уже отправлен' }}</span>
        </template>
      </v-hover>
    </v-btn>
    <v-btn class="grey lighten-2" v-if="isSwapRequestReceived" @click="cancelSwapRequest" style="min-width: 300px;">
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
  props: {
    isSwapRequestAlreadySent: {
      type: Boolean,
      default: false
    },

    isSwapRequestReceived: {
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
  }
  
}
</script>
<style lang="">
  
</style>