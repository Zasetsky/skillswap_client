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
        ...mapGetters("swapRequests", ["getSwapRequests"]),

        myStrongSkillsForUser() {
            const mySkills = this.currentUser.skillsToTeach;
            const userSkills = this.userProfile.skillsToLearn || [];
            const skillsForUser = userSkills.filter(userSkill => {
                return mySkills.some(mySkill => {
                return mySkill._id === userSkill._id;
                });
            });
            return skillsForUser;
        },

        swapRequestId() {
            if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
                return '';
            }

            const request = this.getSwapRequests.find(
                (request) =>
                    request.senderId === this.localUserId ||
                    request.receiverId === this.localUserId
            );

            return request ? request._id : '';
        },

        mySkillToLearn() {
            return this.currentUser.skillsToLearn.find(skill => skill._id === this.$route.query.skillToLearnId) || {};
        },


        isSwapRequestAlreadySent() {
            if (this.getSwapRequests || this.getSwapRequests.length !== 0) {
                return this.getSwapRequests.some(
                (request) => request.receiverId === this.localUserId && (request.status === 'pending' || request.status === 'accepted')
                );
            } else {
                return false;
            }
        },

            isSwapRequestReceived() {
            if (this.getSwapRequests || this.getSwapRequests.length !== 0) {
                return this.getSwapRequests.some(
                (request) => request.senderId === this.localUserId && (request.status === 'pending' || request.status === 'accepted')
                );
            } else {
                return false;
            }
        },
    },

    methods: {
        ...mapActions('user', ['fetchUserProfile', 'fetchCurrentUser']),
        ...mapActions('swapRequests', ['sendSwapRequest', 'deleteSwapRequest', 'getAllSwapRequests']),

        async proposeSkillExchange() {
            const senderData = {
                avatar: this.currentUser.avatar,
                firstName: this.currentUser.firstName,
                lastName: this.currentUser.lastName,
                bio: this.currentUser.bio,
                skillsToLearn: this.mySkillToLearn,
                skillsToTeach: this.myStrongSkillsForUser,
            };

            const receiverData = {
                avatar: this.userProfile.avatar,
                firstName: this.userProfile.firstName,
                lastName: this.userProfile.lastName,
                bio: this.userProfile.bio,
                skillsToLearn: this.mySkillToLearn,
            };
            try {
                await this.sendSwapRequest({ senderId: this.currentUser._id, receiverId: this.localUserId, senderData, receiverData });
                localStorage.setItem("weakSkillId", this.mySkillToLearn._id);
                await this.fetchCurrentUser();
                this.$router.push({ name: 'WeakSkillsPage' });
            } catch (error) {
                console.error('Error creating swap request:', error);
            }
        },

        async cancelSwapRequest() {
            try {
                await this.deleteSwapRequest(this.swapRequestId);
            } catch (error) {
                console.error('Error creating swap request:', error);
            }
        }

    },

    async mounted() {
        try {
            await this.fetchUserProfile(this.localUserId);
            await this.getAllSwapRequests();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    },

};
</script>
