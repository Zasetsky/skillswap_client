<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          v-for="chat in computedChats"
          :key="chat._id"
          @click="openChat(chat._id)"
        >
          <v-hover>
            <v-card slot-scope="{ hover }" :class="{ 'hover': hover }">
              <v-card-title>
                <span>{{ chat.partner }}</span>
              </v-card-title>
              <v-card-subtitle>
                <span v-if="isSender(chat)"><b>Учиться: {{ chat.skillToLearn.skill }}</b></span>
                <span v-else><b>Учить: {{ chat.skillToLearn.skill }}</b></span><br>
                <span v-if="isSender(chat)">Учить: {{ chat.skillToTeach.skill }}</span>
                <span v-else>Учиться: {{ chat.skillToTeach.skill }}</span>
              </v-card-subtitle>
              <v-card-text>
                <span>{{ chat.message }}</span>
                <div style="margin-left: 20px;">{{ chat.messageTime }}</div>
              </v-card-text>
              <v-card-text>
                <div v-if="isReceived(chat)">
                  <v-chip color="primary" small>Принятый</v-chip>
                </div>
                <div v-else>
                  <v-chip color="secondary" small>Отправленный</v-chip>
                </div>
              </v-card-text>
              <!-- <v-card-actions>
                <v-btn color="primary" text small
                  >Открыть чат</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AsyncComputed from "vue-async-computed";

export default {
  mixins: [AsyncComputed],

  data() {
    return {
      computedChats: [],
    };
  },

  computed: {
    ...mapGetters("chat", ["getAllChats"]),
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("user", ["getUserProfile"]),
  },

  asyncComputed: {
    async computedChats() {
      const chats = await Promise.all(
        this.getAllChats.map(async (chat) => {
          const swapRequest = this.getSwapRequests.find(
            (sr) => sr._id === chat.swapRequestId
          );
          if (swapRequest) {
            const partner = await this.getPartnerName(chat);
            const { skillToLearn, skillToTeach } = this.getSkills(swapRequest);
            const { message, messageTime } = await this.getLastMessageAndTime(chat);

            return { ...chat, skillToLearn, skillToTeach, partner, message, messageTime };
          }
          return chat;
        })
      );
      this.computedChats = chats;
      return chats;
    },
  },

  async created() {
    try {
      await this.fetchAllChats();
      await this.getAllSwapRequests();
    } catch (error) {
      console.error("Error getting all chats:", error);
    }
  },

  methods: {
    ...mapActions("chat", ["fetchAllChats"]),
    ...mapActions('swapRequests', ['getAllSwapRequests']),
    ...mapActions('user', ['fetchUserProfile']),

    async getPartnerName(chat) {
      const partnerId = chat.participants.find(
        (participant) => participant !== this.currentUser._id
      );
      await this.fetchUserProfile(partnerId);
      const partnerProfile = this.getUserProfile;

      return partnerProfile ? `${partnerProfile.firstName} ${partnerProfile.lastName}` : '';
    },

    getSkills(swapRequest) {
      const isSender = swapRequest.senderId === this.currentUser._id;
      const skillToLearn = isSender
        ? swapRequest.receiverData.skillsToLearn[0]
        : swapRequest.senderData.skillsToLearn[0];
      const skillToTeach = isSender
        ? swapRequest.senderData.skillsToTeach[0]
        : swapRequest.receiverData.skillsToTeach[0];

      return { skillToLearn, skillToTeach };
    },

    async getLastMessageAndTime(chat) {
      const lastMessage = chat.messages.slice(-1)[0];
      const message = lastMessage ? lastMessage.content : '';
      const messageTime = lastMessage
        ? new Date(lastMessage.createdAt).toLocaleTimeString('RU', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      return { message, messageTime };
    },

    isReceived(chat) {
      const swapRequest = this.getSwapRequests.find(
        (sr) => sr._id === chat.swapRequestId
      );
      return swapRequest && swapRequest.receiverId === this.currentUser._id;
    },

    isSender(chat) {
      const swapRequest = this.getSwapRequests.find(
        (sr) => sr._id === chat.swapRequestId
      );
      return swapRequest && swapRequest.senderId === this.currentUser._id;
    },
    openChat(chatId) {
      // Открыть чат с помощью роутера или другого способа
      this.$router.push(`/${chatId}`);
    },
  },
};
</script>
<style scoped>
.hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
}
</style>
