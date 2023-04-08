<template>
    <div>
      <v-container>
        <v-row>
            <v-col>
                <v-avatar size="120">
                <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="User avatar">
                <img v-else src="https://via.placeholder.com/150" alt="User avatar">
                </v-avatar>
            </v-col>
            <v-col>
                <h2>{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
                <h4>Биография:</h4>
                <p>{{ userProfile.bio }}</p>
                <v-btn
                    v-if="!isSwapRequestAlreadySent && !isSwapRequestReceived"
                    color="primary"
                    @click="proposeSkillExchange"
                >
                    Предложить обмен навыками
                </v-btn>
                <v-btn
                    class="grey lighten-2"
                    v-else-if="isSwapRequestAlreadySent"
                    @click="cancelSwapRequest"
                >
                    <v-hover>
                        <template  v-slot:default="{ hover }">
                        <span style="min-width: 286px;">{{ hover ? 'Отменить запрос' : 'Запрос на обмен уже отправлен' }}</span>
                        </template>
                    </v-hover>
                </v-btn>
                <v-btn
                    class="grey lighten-2"
                    v-else
                    @click="cancelSwapRequest"
                    style="min-width: 300px;"
                >
                    <v-hover>
                        <template v-slot:default="{ hover }">
                        <span style="min-width: 269px;">{{ hover ? 'Отклонить запрос' : 'Запрос на обмен уже получен' }}</span>
                        </template>
                    </v-hover>
                </v-btn>
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

        swapRequestId() {
            let swapRequestId = '';
            if (this.currentUser) {
                this.currentUser.swapRequests.forEach((request) => {
                if (request.senderData.id === this.localUserId) {
                    swapRequestId = request.senderData.id;
                } else {
                    swapRequestId = request.receiverData.id
                }
                });
            }
            return swapRequestId;
        },

        mySkillToLearn() {
            return this.currentUser.skillsToLearn.find(skill => skill._id === this.$route.query.skillToLearnId) || {};
        },


        isSwapRequestAlreadySent() {
            if (this.currentUser) {
                return this.currentUser.swapRequests.some(
                    (request) => request.receiverData.id === this.localUserId
                );
            } else {
                return false;
            }
        },

        isSwapRequestReceived() {
            if (this.currentUser) {
                return this.currentUser.swapRequests.some(
                (request) => request.senderData.id === this.localUserId
                );
            } else {
                return false;
            }
        },
    },



    async created() {
        try {
            await this.fetchUserProfile(this.localUserId);
            // await this.fetchCurrentUser();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    },


    methods: {
        ...mapActions('user', ['fetchUserProfile']),
        ...mapActions('user', ['fetchCurrentUser']),
        ...mapActions('swapRequests', ['sendSwapRequest', 'deleteSwapRequest']),
        

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
            await this.fetchCurrentUser();
            } catch (error) {
            console.error('Error creating swap request:', error);
            }
        },
        async cancelSwapRequest() {
            try {
                await this.deleteSwapRequest(this.swapRequestId);
                await this.fetchCurrentUser();
            } catch (error) {
                console.error('Error creating swap request:', error);
            }
        }
    },
    // mounted() {
    //     console.log('user: ', this.currentUser);
    //     console.log('localId: ', this.localUserId);
    //     console.log('swapId: ', this.swapRequestId);
    // }
};
</script>
