<template>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3" v-for="chat in chats" :key="chat.id">
            <v-card>
              <v-card-title>
                <span>{{ chat.skill.name }}</span>
              </v-card-title>
              <v-card-subtitle>
                <span>{{ chat.partner.name }}</span>
              </v-card-subtitle>
              <v-card-text>
                <div v-if="isReceived(chat)">
                  <v-chip color="primary" small>Принятый</v-chip>
                </div>
                <div v-else>
                  <v-chip color="secondary" small>Отправленный</v-chip>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text small @click="openChat(chat.id)">Открыть чат</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
        chats: [], // Здесь должны быть данные всех чатов пользователя
        currentUserId: 1, // Здесь должен быть ID текущего пользователя
        };
    },
    methods: {
        isReceived(chat) {
        return chat.senderId === this.currentUserId;
        },
        openChat(chatId) {
        // Открыть чат с помощью роутера или другого способа
        this.$router.push({ name: "Chat", params: { id: chatId } });
        },
    },
};
</script>