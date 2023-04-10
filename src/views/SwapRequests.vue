<template>
    <v-container>
      <v-row>
        <!-- <v-col cols="12" sm="6">
            <h2>Отправленные запросы</h2>
            <v-card v-for="sentRequest in sentRequests" :key="sentRequest._id" class="mb-4">
                <v-card-text>
                    <v-avatar size="64" class="mb-2">
                    <img :src="sentRequest.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
                    </v-avatar>
                    
                    <strong>Имя:</strong> {{ sentRequest.firstName }} {{ sentRequest.lastName }}<br>
                    <strong>Описание:</strong> {{ sentRequest.bio }}<br>

                    <strong>Хочу изучить:</strong> {{ sentRequest.skillToLearn }}<br>

                    <v-btn class="mt-4" color="primary" @click="cancelSwapRequest(sentRequest._id)">
                        Отменить запрос
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-col> -->
        <v-col cols="12" sm="6">
          <h2>Полученные запросы</h2>
          <v-card v-for="receivedRequest in receivedRequests" :key="receivedRequest._id" class="mb-4">
            <v-card-text>
              <strong>Имя:</strong> {{ receivedRequest.firstName }} {{ receivedRequest.lastName }}<br>
              <strong>Описание:</strong> {{ receivedRequest.bio }}<br>
              <v-btn class="mt-4" color="primary" @click="acceptSwapRequest(receivedRequest._id)">
                Принять запрос
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { mapGetters, mapActions } from "vuex";
  
  export default {
    computed: {
        ...mapGetters("auth", ["currentUser"]),
        receivedRequests() {
            return this.currentUser.swapRequests
            .map(request => request.senderData)
            .filter(senderData => senderData.lastName);
        },
    },
    methods: {
      ...mapActions("swapRequests", [
        "cancelSwapRequest",
        "acceptSwapRequest",
      ]),
    },
    mounted() {
      console.log('полученные: ', this.receivedRequests);
    }
  };
  </script>
  