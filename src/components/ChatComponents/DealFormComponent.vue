<template>
  <div>
    <v-dialog v-model="dialog" width="600" @click:outside="resetForm">
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
        color="primary"
        v-bind="attrs"
        v-on="on"
        @click="deal.status === 'confirmed' ? emitSendZoomLink() : openDialog"
      >
        {{ getActionButtonText }}
      </v-btn>
      </template>

      <v-card>
        <v-card-title>Форма согласования сделки</v-card-title>
        <v-tabs v-model="activeTab" background-color="transparent" show-arrows>
          <v-tab v-for="(tab, index) in tabs" :key="index">{{ tab }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item :value="0">
            <v-row>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form1.meetingDate"
                      label="В какой день"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form1.meetingDate" @input="menu = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-time-picker v-model="form1.meetingTime" format="24hr"></v-time-picker>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form1.meetingDuration"
                  label="Продолжительность встречи (минут)"
                  type="number"
                  min="30"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item :value="1">
            <v-row>
              <v-col cols="12">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form2.meetingDate"
                      label="В какой день"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form2.meetingDate" @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-time-picker v-model="form2.meetingTime" format="24hr"></v-time-picker>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form1.meetingDuration"
                  label="Продолжительность встречи (минут)"
                  type="number"
                  min="30"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
          <v-btn 
            v-if="(!isConfirm || isFormChanged) && deal.status === 'pending'"
            color="blue darken-1"
            :disabled="!isFormChanged"
            text
            @click="submitForm"
          >
            Отправить
          </v-btn>
          <v-btn 
            v-else-if="deal.status === 'not_started'"
            color="blue darken-1"
            :disabled="!isBothFormsFilled"
            text
            @click="submitForm"
          >
            Отправить
          </v-btn>
          <v-btn v-else color="blue darken-1" text @click="emitConfirmDeal">Подтвердить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: {
        deal: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
          dialog: false,
          menu: false,
          menu2: false,
          activeTab: 0,
          tabs: [],
          form1: {
            meetingDate: null,
            meetingTime: null,
            meetingDuration: null,
          },
          form2: {
            meetingDate: null,
            meetingTime: null,
          },
        };
    },

    computed: {
      ...mapGetters('auth', ['currentUser']),
      ...mapGetters('chat', ['getCurrentChat']),

      getActionButtonText() {
          const currentUser = this.currentUser;
          const deal = this.deal;

          if (!currentUser || !deal) return "Согласовать сделку";
          if (deal.status === "not_started") return "Согласовать сделку";
          if (deal.status === "pending" && deal.sender === currentUser._id) return "Изменить предложение";
          if (deal.status === "pending" && deal.sender !== currentUser._id) return "Подтвердить сделку";
          return "Согласовать сделку";
      },

      isFormChanged() {
        return (
          (this.form1.meetingDate && this.deal.form && this.deal.form.meetingDate && this.form1.meetingDate !== this.deal.form.meetingDate) ||
          (this.form1.meetingTime && this.deal.form && this.deal.form.meetingTime && this.form1.meetingTime !== this.deal.form.meetingTime) ||
          (this.form1.meetingDuration && this.deal.form && this.deal.form.meetingDuration && this.form1.meetingDuration !== this.deal.form.meetingDuration) ||
          (this.form2.meetingDate && this.deal.form2 && this.deal.form2.meetingDate && this.form2.meetingDate !== this.deal.form2.meetingDate) ||
          (this.form2.meetingTime && this.deal.form2 && this.deal.form2.meetingTime && this.form2.meetingTime !== this.deal.form2.meetingTime)
        );
      },

      isBothFormsFilled() {
        return (
          this.form1.meetingDate &&
          this.form1.meetingTime &&
          this.form1.meetingDuration &&
          this.form2.meetingDate &&
          this.form2.meetingTime
        );
      },

      isConfirm() {
        const deal = this.deal;
        const currentUser = this.currentUser;

        return (
          deal &&
          deal.status === "pending" &&
          deal.sender !== currentUser._id
        );
      },

    },

    created() {
      if (this.deal && this.deal.form) {
        this.form1.meetingDate = this.deal.form.meetingDate || null;
        this.form1.meetingTime = this.deal.form.meetingTime || null;
        this.form1.meetingDuration = this.deal.form.meetingDuration || null;
        this.form2.meetingDate = this.deal.form2.meetingDate || null;
        this.form2.meetingTime = this.deal.form2.meetingTime || null;
      } else {
        this.form1.meetingDate = null;
        this.form1.meetingTime = null;
        this.form1.meetingDuration = null;
        this.form2.meetingDate = null;
        this.form2.meetingTime = null;
      }

      this.setTabs();
    },

    methods: {
      setTabs() {
        const swapRequestId = this.getCurrentChat.swapRequestId;
        const swapRequest = this.currentUser.swapRequests.find((request) => request._id === swapRequestId);

        if (swapRequest && swapRequest.senderData && swapRequest.receiverData) {
          const skillsToTeach = swapRequest.senderData.skillsToTeach?.[0]?.skill || swapRequest.receiverData.skillsToTeach?.[0]?.skill;
          const skillsToLearn = swapRequest.senderData.skillsToLearn?.[0]?.skill || swapRequest.receiverData.skillsToLearn?.[0]?.skill;

          if (skillsToTeach && skillsToLearn) {
            this.tabs.push(skillsToLearn);
            this.tabs.push(skillsToTeach);
            this.activeTab = 0;
          } else {
            console.error('Не удалось найти данные навыков');
          }
        }
      },

      openDialog() {
        this.dialog = true;
      },

      submitForm() {
        // Проверяем, заполнены ли обе формы
        if (!this.form1.meetingDate || !this.form1.meetingTime || !this.form1.meetingDuration) {
          alert('Пожалуйста, заполните все поля для первой формы');
          return;
        }
        if (!this.form2.meetingDate || !this.form2.meetingTime || !this.form1.meetingDuration) {
          alert('Пожалуйста, заполните все поля для второй формы');
          return;
        }

        // Передаем обе формы
        this.$emit('submit-deal-form', {
        formData1: {
          meetingDate: this.form1.meetingDate,
          meetingTime: this.form1.meetingTime,
          meetingDuration: this.form1.meetingDuration,
        },
        formData2: {
          meetingDate: this.form2.meetingDate,
          meetingTime: this.form2.meetingTime,
          meetingDuration: this.form1.meetingDuration,
        },
      });

        this.dialog = false;
      },

      emitConfirmDeal() {
        this.$emit("confirm-deal");
        this.dialog = false;
      },

      close() {
        this.resetForm();
        this.dialog = false;
      },

      resetForm() {
        if (!this.deal || !this.deal.form) {
          this.form1 = {
            meetingDate: null,
            meetingTime: null,
            meetingDuration: null,
          };
          this.form2 = {
            meetingDate: null,
            meetingTime: null,
          };
        } else {
          this.form1 = {
            meetingDate: this.deal.form.meetingDate || null,
            meetingTime: this.deal.form.meetingTime || null,
            meetingDuration: this.deal.form.meetingDuration || null,
          };
          this.form2 = {
            meetingDate: this.deal.form2.meetingDate || null,
            meetingTime: this.deal.form2.meetingTime || null,
          };
        }
        this.dialog = false;
      },
    },
};
</script>