<template>
  <div>
    <v-btn 
      class="next-button"
      color="primary"
      :disabled="disabled"
      @click="$emit('open-window')"
    >
      Далее
    </v-btn>

    <v-dialog v-model="localShowModal" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Подтверждение действия</span>
        </v-card-title>

        <v-card-text>Вы действительно хотите продолжить с выбранными навыками? Подумайте, возможно стоит выбрать все три, чтобы было легче найти партнера для обмена.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="proceedAnyway">Да</v-btn>
          <v-btn color="green darken-1" text @click="closeWindow">Нет</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    value: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    localShowModal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },

  methods: {
    proceedAnyway() {
      this.localShowModal = false;
      this.$emit("go-to-next-step");
    },

    closeWindow() {
      this.localShowModal = false;
    }
  }
};
</script>
<style scoped>
.next-button {
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  text-transform: none;
  max-width: 10rem;
}
</style>