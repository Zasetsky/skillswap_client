<template>
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
              v-model="form.meetingDate"
              label="В какой день"
              readonly
              v-bind="attrs"
              v-on="on"
              :class="{ 'highlight-field': highlightMismatchedFields.meetingDate }"
            ></v-text-field>
          </template>
        <v-date-picker
          v-model="form.meetingDate"
          @input="menu = false; updateForm('meetingDate', form.meetingDate)"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-time-picker
        v-model="form.meetingTime"
        format="24hr"
        :class="{ 'highlight-field': highlightMismatchedFields.meetingTime }"
        @input="updateForm('meetingTime', form.meetingTime)"
      >
      </v-time-picker>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="form.meetingDuration"
        label="Продолжительность встречи (минут)"
        type="number"
        min="30"
        :class="{ 'highlight-field': highlightMismatchedFields.meetingDuration }"
        @input="updateMeetingDuration"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    highlightMismatchedFields: {
      type: Object,
      default: () => ({}),
    },
    formName: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    ...mapGetters('dealFormLocalState', ['getForm1', 'getForm2']),
    ...mapGetters('dealFormLocalState', ['commonMeetingDuration']),
    form() {
      const form = this.formName === 'form1' ? this.getForm1 : this.getForm2;
      return { ...form, meetingDuration: this.commonMeetingDuration };
    }
  },
  methods: {
    updateForm(key, value) {
      const updatedForm = { ...this.form, [key]: value };
      if (this.formName === 'form1') {
        this.$store.dispatch('dealFormLocalState/setForm1', updatedForm);
      } else {
        this.$store.dispatch('dealFormLocalState/setForm2', updatedForm);
      }
    },

    updateMeetingDuration() {
      this.$store.dispatch('dealFormLocalState/setCommonMeetingDuration', this.form.meetingDuration);
    },
  },
};
</script>

<style scoped>
.highlight-field {
  border: 2px solid red;
}

</style>