<template>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <v-avatar size="120">
              <img v-if="userProfile.avatar" :src="userProfile.avatar">
              <img v-else src="https://via.placeholder.com/150">
            </v-avatar>
          </v-col>
          <v-col>
            <h2>{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
            <h4>Биография:</h4>
            <p>{{ userProfile.bio }}</p>
            <v-btn color="primary" @click="proposeSkillExchange">Предложить обмен навыками</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Прогресс в сильных навыках:</h4>
            <v-progress-linear 
                v-for="skill in userProfile.strongSkills" 
                :key="skill.name" 
                :value="skill.progress" 
                :buffer-value="100" 
                class="mb-4"
            >
              <strong>{{ skill.name }}:</strong> {{ skill.progress }}%
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>
  
  
<script>
import { mapState, mapActions, mapGetters  } from 'vuex';

export default {
    props: {
        userId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            localUserId: this.userId || '',
        };
    },


    computed: {
        ...mapState('user', ['userProfile']),
        ...mapGetters('auth', ['currentUser']),

        myStrongSkillsForUser() {
            const mySkills = this.currentUser.skillsToTeach;
            const userSkills = this.userProfile.skillsToLearn || [];
            const skillsForUser = userSkills.filter(userSkill => {
                return mySkills.some(mySkill => {
                return (
                    mySkill.skill === userSkill.skill &&
                    mySkill.subCategory === userSkill.subCategory &&
                    mySkill.category === userSkill.category &&
                    mySkill.theme === userSkill.theme
                );
                });
            });
            return skillsForUser;
        },

        mySkillToLearn() {
            let skill = {};
            for (let i = 0; i < this.currentUser.skillsToLearn.length; i++) {
                const element = this.currentUser.skillsToLearn[i];
                if(this.$route.query.skillToLearnId === element._id) {
                    skill = element;
                }
            }
            return skill;
        },
    },


    async created() {
        try {
            await this.fetchUserProfile(this.localUserId);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    },


    methods: {
        ...mapActions('user', ['fetchUserProfile']),
        ...mapActions('swapRequests', ['sendSwapRequest']),

        async proposeSkillExchange() {
            const senderData = {
                id: this.currentUser._id,
                avatar: this.currentUser.avatar,
                firstName: this.currentUser.firstName,
                lastName: this.currentUser.lastName,
                bio: this.currentUser.bio,
                skillsToLearn: this.mySkillToLearn,
                skillsToTeach: this.myStrongSkillsForUser,
            };

            const receiverData = {
                id: this.userId,
                avatar: this.userProfile.avatar,
                firstName: this.userProfile.firstName,
                lastName: this.userProfile.lastName,
                bio: this.userProfile.bio,
                skillsToLearn: this.mySkillToLearn,
                skillsToTeach: '', // Здесь будет ответ пользователя, если он согласится
            };
            console.log(this.userProfile);
            try {
            await this.sendSwapRequest({ senderData, receiverData });
            console.log('Swap request created successfully');
            } catch (error) {
            console.error('Error creating swap request:', error);
            }
        },
    },
    mounted() {
        console.log(this.mySkillToLearn);
    }
};
</script>
  