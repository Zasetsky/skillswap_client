<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>{{ skillObject.skill || skillObject.category || skillObject.subCategory }}</h2>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="12">
        <h3>История запросов и выполненных сделок</h3>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col cols="12" sm="6">
        <h3>Активный запрос</h3>
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
      </v-col>
      <v-col cols="12" sm="6">
        <h3>История запросов и выполненных сделок</h3>
        <v-card>
          <!-- Заполните данные активной сделки -->
          <v-card-text>Здесь будет информация об активной сделке</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
 import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    skillObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Заполните исходные данные компонента
    };
  },
  computed: {
        ...mapGetters("auth", ["currentUser"]),
        sentRequests() {
            return this.currentUser.swapRequests
            .map(request => request.receiverData)
            .filter(receiverData => receiverData.lastName);
        },
    },
    methods: {
      ...mapActions("swapRequests", [
        "cancelSwapRequest",
        "acceptSwapRequest",
      ]),
    },
    mounted() {
      console.log('отправленные: ', this.sentRequests);
      console.log('полученные skkil: ', this.skillObject);
    }
};
</script>

<style scoped>
/* Стили для компонента WeakSkillsPage */
</style>
