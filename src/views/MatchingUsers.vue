<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2>Найдите подходящих пользователей для обмена навыками</h2>
          <SkillSelect />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
            <MatchingUserItem />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
  
<script>
import SkillSelect from '../components/MatchingComponents/SkillSelect.vue';
import MatchingUserItem from '../components/MatchingComponents/MatchingUserItem.vue';

export default {
  components: {
    SkillSelect,
    MatchingUserItem
  },
};
</script>
  