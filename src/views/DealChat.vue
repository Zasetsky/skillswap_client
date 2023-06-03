<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <MessageComponent
        v-for="message in messages"
        :key="message._id"
        :message="message"
        :allMessages="messages"
        @open-deal-form="openDialog"
        @approve-cancellation="handleApproveCancellation"
        @reject-cancellation="handleRejectCancellation"
        @approve-continuation="handleApproveContinuation"
        @reject-continuation="handleRejectContinuation"
      />
    </div>
    <div class="bottom-bar">
      <div style="display: flex; justify-content: space-between;">
        <DealComponentWrapper
          :disabled="!showCancelButton && !ishalfCompletedStatus || isSender"
          @open-deal-form="openDialog"
          @submit-deal-form="emitSubmitForm"
          @confirm-deal="emitConfirmDeal"
          @confirm-reschedule="emitConfirmReschedule"
          @reject-reschedule="emitRejectReschedule"
        />
        <ContinuationButton
          v-if="showContinuationButton"
          @propose-continuation="emitProposeContinuation"
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
import DealComponentWrapper from '@/components/ChatComponents/Deal/DealComponentWrapper.vue';
import CancelDealButton from '@/components/ChatComponents/Buttons/CancelDealButton.vue';
import ContinuationButton from '@/components/ChatComponents/Buttons/ContinuationButton.vue';
import ReviewForm from '@/components/ChatComponents/Buttons/ReviewForm.vue';

export default {
  components: {
    MessageComponent,
    MessageForm,
    DealComponentWrapper,
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
    ...mapGetters('dealFormLocalState', ['completedForms']),
    ...mapGetters('swapRequests', ['getCurrentSwapRequest']),
    ...mapGetters('review', ['getCurrentDealReviews']),

    messages() {
      return this.$store.state.chat.currentChat
        ? this.$store.state.chat.currentChat.messages
        : [];
    },

    isSender() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      const isSender = deal.sender === currentUser._id;
      const isPendingStasuses = ["pending", "pending_update", "reschedule_offer", "reschedule_offer_update"].includes(deal.status);
      
      if (deal && currentUser) {
        return isSender && isPendingStasuses;
      }

      return false;
    },

    ishalfCompletedStatus() {
      const currentDeal = this.getCurrentDeal;

      if (!currentDeal) {
        return false;
      }

      const specialStatuses = ['half_completed', 'half_completed_confirmed_reschedule', 'reschedule_offer', 'reschedule_offer_update'];

      return specialStatuses.includes(currentDeal.status);
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
      const isRejected = cancellationStatus === 'false';

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

      return currentDeal.continuation.status;
    },

    isCancelButtonCloseToDeadline() {
      const deal = this.getCurrentDeal;
      if (!deal) {
        return true;
      }

      const formTypes = ['form', 'form2'];
      const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;

      for (let formType of formTypes) {
        const form = deal[formType];
        if (form && form.meetingDate && form.meetingTime) {
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

          if (remainingTimeInMilliseconds <= threeHoursInMilliseconds) {
            return true;
          }
        }
      }

      return false;
    },

    showReviewForm() {
      const deal = this.getCurrentDeal;
      const swapRequest = this.getCurrentSwapRequest;

      if (!swapRequest) {
        return false;
      }

      const isSender = swapRequest.senderId === this.currentUser._id;
      const isReceiver = swapRequest.receiverId === this.currentUser._id;

      const isForm1Completed = deal && deal.completedForm && deal.completedForm.includes('form');
      const isForm2Completed = deal && deal.completedForm && deal.completedForm.includes('form2');

      const showForm1Button = isForm1Completed && isSender && !this.isReviewSubmitted('form');
      const showForm2Button = isForm2Completed && isReceiver && !this.isReviewSubmitted('form2');

      return showForm1Button || showForm2Button;
    },
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
      console.log("Review submitted successfully");
    },


    async openDialog() {
      this.$store.dispatch('dealButtonsLocalState/setIsDialogOpen', true);
      this.$emit("open-deal-form");
    },

    emitSubmitForm() {
      this.$emit('submit-deal-form');
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

    emitProposeContinuation() {
      this.newMessage = "";
      this.$emit("propose-continuation");
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
      this.$store.dispatch("deal/toggleIsSending");
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
        await this.sendMessage("details", "Предложение о продолжении отвергнуто");
      } catch (error) {
        console.error("Error rejecting continuation:", error);
      }
    },

    emitConfirmDeal() {
      this.$emit("confirm-deal");
    },

    emitConfirmReschedule() {
      this.$emit("confirm-reschedule");
    },

    emitRejectReschedule() {
      this.$emit("reject-reschedule");
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
      await this.$store.dispatch("deal/fetchCurrentDeal", {
        chatId: this.getCurrentChat._id,
      });

      const otherUserId = this.getCurrentDeal.participants.filter(id => id !== this.currentUser._id)[0];
      await this.$store.dispatch("user/fetchUserProfile", otherUserId);

      await this.$store.dispatch("swapRequests/fetchCurrentSwapRequest", this.getCurrentDeal.swapRequestId);
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

