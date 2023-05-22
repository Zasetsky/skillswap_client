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
              v-model="localForm.meetingDate"
              label="В какой день"
              readonly
              v-bind="attrs"
              v-on="on"
              :class="{ 'highlight-field': highlightMismatchedFields.meetingDate }"
            ></v-text-field>
          </template>
        <v-date-picker
          v-model="localForm.meetingDate"
          @input="menu = false; updateForm('meetingDate', localForm.meetingDate)"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-time-picker
        v-model="localForm.meetingTime"
        format="24hr"
        :class="{ 'highlight-field': highlightMismatchedFields.meetingTime }"
        @input="updateForm('meetingTime', localForm.meetingTime)"
      >
      </v-time-picker>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="localForm.meetingDuration"
        label="Продолжительность встречи (минут)"
        type="number"
        min="30"
        :class="{ 'highlight-field': highlightMismatchedFields.meetingDuration }"
        @input="updateForm('meetingDuration', localForm.meetingDuration)"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    highlightMismatchedFields: {
      type: Object,
      default: () => ({}),
    },
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      menu: false,
      localForm: {
        meetingDate: this.form.meetingDate,
        meetingTime: this.form.meetingTime,
        meetingDuration: this.form.meetingDuration,
      },
    };
  },
  methods: {
    updateForm(key, value) {
      this.$emit("update:form", { ...this.form, [key]: value });
    },
  },
  watch: {
    form: {
      deep: true,
      handler(newValue) {
        this.localForm = { ...newValue };
      },
    },
  },
};
</script>
<style scoped>
.highlight-field {
  border: 2px solid red;
}

</style>