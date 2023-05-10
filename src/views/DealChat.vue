<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <MessageComponent
        v-for="message in messages"
        :key="message._id"
        :message="message"
        :allMessages="messages"
        :currentUserId="currentUser._id"
        @open-deal-form="handleOpenDealForm"
        @approve-cancellation="handleApproveCancellation"
        @reject-cancellation="handleRejectCancellation"
        @approve-continuation="handleApproveContinuation"
        @reject-continuation="handleRejectContinuation"
      />
    </div>
    <div class="bottom-bar">
      <div style="display: flex; justify-content: space-between;">
        <DealComponent
          ref="dealForm"
          :disabled="!showCancelButton"
          @submit-deal-form="handleDealFormSubmit"
          @confirm-deal="confirmDeal"
        />
        <ContinuationButton
          v-if="showContinuationButton"
          @propose-continuation="handleRequestContinuation"
        />
        <ReviewForm
          v-if="showReviewForm"
          @review-submitted="onReviewSubmitted"
        />
        <CancelDealButton
          v-if="!isCancelButtonCloseToDeadline && showCancelButton"
          :disabled="!newMessage"
          @cancel-deal="handleCancelDeal"
        />
      </div>
      <MessageForm
        v-model="newMessage" 
        @send-message="sendMessage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MessageComponent from '@/components/ChatComponents/MessageComponent.vue';
import MessageForm from '@/components/ChatComponents/MessageFormComponent.vue';
import DealComponent from '@/components/ChatComponents/DealComponent.vue';
import CancelDealButton from '@/components/ChatComponents/CancelDealButton.vue';
import ContinuationButton from '@/components/ChatComponents/ContinuationButton.vue';
import ReviewForm from '@/components/ChatComponents/ReviewForm.vue';

export default {
  components: {
    MessageComponent,
    MessageForm,
    DealComponent,
    CancelDealButton,
    ContinuationButton,
    ReviewForm,
  },

  data() {
    return {
      newMessage: "",
    };
  },

  computed: {
    ...mapGetters('chat', ['getCurrentChat']),
    ...mapGetters('deal', ['getCurrentDeal']),
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('swapRequests', ['getCurrentSwapRequest']),
    ...mapGetters('review', ['getCurrentDealReviews']),

    messages() {
      return this.$store.state.chat.currentChat
        ? this.$store.state.chat.currentChat.messages
        : [];
    },

    showCancelButton() {
      const currentDeal = this.getCurrentDeal;

      if (!currentDeal) {
        return false;
      }

      // Проверка завершенности форм
      const isFormCompleted = currentDeal.form && currentDeal.form.isCompleted;
      const isForm2Completed = currentDeal.form2 && currentDeal.form2.isCompleted;

      // Если одна из форм завершена, то кнопка не должна отображаться
      if (isFormCompleted || isForm2Completed) {
        return false;
      }

      if (!currentDeal.cancellation) {
        return true;
      }

      const cancellationStatus = currentDeal.cancellation.status;
      const isRejected = cancellationStatus === 'rejected';

      const isCompleted = currentDeal.status === 'completed';

      if (isCompleted) {
        return false;
      }

      return !cancellationStatus || isRejected;
    },

    showContinuationButton() {
      const currentDeal = this.getCurrentDeal;

      if (!currentDeal) {
        return false;
      }

      if (currentDeal.status !== 'completed') {
        return false;
      }

      if (!currentDeal.continuation) {
        return true;
      }

      const isRejectedOrApproved = currentDeal.continuation.status === 'false' || currentDeal.continuation.status === 'approved';

      return isRejectedOrApproved;
    },

    isCancelButtonCloseToDeadline() {
      const deal = this.getCurrentDeal;
      if (!deal || deal.status !== 'confirmed') {
        return false;
      }

      const form = deal.update && deal.update.form ? deal.update.form : deal.form;
      if (!form || !form.meetingDate || !form.meetingTime) {
        return false;
      }

      const meetingDate = new Date(form.meetingDate);
      const meetingTime = form.meetingTime.split(':');
      const deadline = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate(),
        parseInt(meetingTime[0]),
        parseInt(meetingTime[1])
      );

      const now = new Date();
      const remainingTimeInMilliseconds = deadline - now;
      const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;

      return remainingTimeInMilliseconds <= threeHoursInMilliseconds;
    },

    showReviewForm() {
      const deal = this.getCurrentDeal;
      const swapRequest = this.getCurrentSwapRequest;

      if (!swapRequest) {
        return false;
      }

      const isSender = swapRequest.senderId === this.currentUser._id;
      const isReceiver = swapRequest.receiverId === this.currentUser._id;

      const isForm1Completed = deal.completedForm.includes('form');
      const isForm2Completed = deal.completedForm.includes('form2');

      const showForm1Button = isForm1Completed && isSender && !this.isReviewSubmitted('form');
      const showForm2Button = isForm2Completed && isReceiver && !this.isReviewSubmitted('form2');

      return showForm1Button || showForm2Button;
    }
  },

  methods: {
    isReviewSubmitted(formType) {
      const currentUserId = this.currentUser._id;
      const reviews = this.getCurrentDealReviews || [];

      return reviews.some(
        (review) =>
          review.sender.toString() === currentUserId &&
          review.formType === formType
      );
    },

    async sendMessage(type, content) {
      try {
        const newMessage = {
          chatId: this.getCurrentChat._id,
          type: type || 'text',
          content,
          sender: this.currentUser._id
        };

        await this.$store.dispatch("chat/sendMessage", newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    },

    onReviewSubmitted() {
      // Здесь вы можете обработать успешную отправку отзыва, например:
      // 1. Вывести уведомление или сообщение об успешной отправке отзыва
      // 2. Очистить и закрыть форму отзыва
      // 3. Обновить чат или список отзывов
      console.log("Review submitted successfully");
    },

    async handleDealFormSubmit({ formData1, formData2 }) {
      this.$refs.dealForm.isSubmitting = true;

      const statusesOfReschedule = ["confirmed", "reschedule_offer", "reschedule_offer_update"];
      try {
        if (!statusesOfReschedule.includes(this.getCurrentDeal.status)) {
          await this.$store.dispatch("deal/updateDeal", {
            dealId: this.getCurrentDeal._id,
            formData1,
            formData2,
          });

          await this.sendMessage("deal_proposal", " ");

        } else {
          await this.$store.dispatch("deal/proposeRescheduleDeal", {
            dealId: this.getCurrentDeal._id,
            rescheduleFormData1: formData1,
            rescheduleFormData2: formData2,
          });

          await this.sendMessage("reschedule_proposal", " ");
        }

      } catch (error) {
          console.error("Error during async submit:", error);
      } finally {
        this.$refs.dealForm.isSubmitting = false;
      }
    },

    async handleOpenDealForm() {
      try {
          await this.$store.dispatch("deal/getCurrentDeal", {
            chatId: this.getCurrentChat._id,
          });
        } catch (error) {
          console.error("Error fetching current deal: ", error);
        } 
      this.$refs.dealForm.openDialog();
    },

    async handleCancelDeal() {
      const reason = this.newMessage;
      try {
        await this.sendMessage("cancellation_request", { reason });
        await this.$store.dispatch("deal/requestCancellation", {
          dealId: this.getCurrentDeal._id,
          reason,
          timestamp: new Date(),
        });
        this.newMessage = "";
      } catch (error) {
        console.error("Error requesting cancellation:", error);
      }
    },

    async handleRequestContinuation() {
      try {
        await this.sendMessage("continuation_request", " ");
        await this.$store.dispatch("deal/requestContinuation", {
          dealId: this.getCurrentDeal._id
        });
        this.newMessage = "";
      } catch (error) {
        console.error("Error requesting continuation:", error);
      }
    },

    async handleApproveCancellation() {
      try {
        await this.$store.dispatch("deal/approveCancellation", {
          dealId: this.getCurrentDeal._id,
        });
      } catch (error) {
        console.error("Error approving cancellation:", error);
      }
    },

    async handleApproveContinuation() {
      try {
        await this.$store.dispatch("deal/approveContinuation", {
          dealId: this.getCurrentDeal._id,
        });
      } catch (error) {
        console.error("Error approving continuation:", error);
      }
    },

    async handleRejectCancellation() {
      try {
        await this.$store.dispatch("deal/rejectCancellation", {
          dealId: this.getCurrentDeal._id,
        });
      } catch (error) {
        console.error("Error rejecting cancellation:", error);
      }
    },

    async handleRejectContinuation() {
      try {
        await this.$store.dispatch("deal/rejectContinuation", {
          dealId: this.getCurrentDeal._id,
        });
        await this.sendMessage("details", "Предложение о продолжении отвергнуто.");
      } catch (error) {
        console.error("Error rejecting continuation:", error);
      }
    },

    getMeetingDetails() {
      const deal = this.getCurrentDeal;

      if (deal.update && deal.update.form) {
        return deal.update.form;
      } else if (deal.form) {
        return deal.form;
      } else {
        return null;
      }
    },

    async confirmDeal() {
      try {
        const meetingDetails = this.getMeetingDetails();

        if (meetingDetails) {
          await this.sendMessage("meeting_details", {
            meetingLink: "your-meeting-link",
            password: "your-password",
            ...meetingDetails,
          });
          await this.$store.dispatch("deal/confirmDeal", {
            dealId: this.getCurrentDeal._id,
          });
        } else {
          console.warn("No meeting details found");
        }
      } catch (error) {
        console.error("Error confirming deal:", error);
      }
    },
  },

  watch: {
    messages(newVal, oldVal) {
      if (newVal.length > oldVal.length) {
        this.scrollToBottom();
      }
    },
  },

  async mounted() {
    try {
      const chatId = localStorage.getItem("chatId");

      await this.$store.dispatch("chat/fetchCurrentChat", chatId);
      await this.$store.dispatch("deal/getCurrentDeal", {
        chatId: this.getCurrentChat._id,
      });
      await this.$store.dispatch("swapRequests/getCurrentSwapRequest", this.getCurrentDeal.swapRequestId);
      await this.$store.dispatch("review/getCurrentDealReviews", this.getCurrentDeal._id);

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    } catch (error) {
      console.error("Error in mounted lifecycle hook:", error);
    }
  }
};

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px;
  height: 400px;
  max-height: 100%;
}

.bottom-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}
</style>

