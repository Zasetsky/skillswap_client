import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reviews'

const state = {
    reviews: {},
}

const getters = {
    getUserReviews: (state) => (userId) => state.reviews[userId] || [],
}

const actions = {
    async createReview({ commit }, payload) {
        try {
            const response = await axios.post(`${API_URL}/create`, payload);
            const review = response.data.review;

            commit('ADD_REVIEW_TO_EXISTING_REVIEWS', review);

        } catch (error) {
            console.error('Error creating review:', error?.response?.data?.error);
        }
    },

    async fetchUserReviews({ commit, state }, userId) {
        if (!state.reviews[userId]) {
          try {
            const response = await axios.get(`${API_URL}/${userId}`);
            const reviews = response.data.reviews;
    
            commit('SET_USER_REVIEWS', { userId, reviews });
    
          } catch (error) {
            console.error('Error getting user reviews:', error?.response?.data?.error);
          }
        }
    },
}

const mutations = {
    ADD_REVIEW_TO_EXISTING_REVIEWS(state, review) {
        const existingReviewIndex = state.reviews.findIndex(
          (r) => r._id === review._id
        );
    
        if (existingReviewIndex === -1) {
          state.reviews.push(review);
        } else {
          state.reviews[existingReviewIndex] = review;
        }
    },

    SET_USER_REVIEWS(state, { userId, reviews }) {
        if (Array.isArray(reviews)) {
          state.reviews = { ...state.reviews, [userId]: reviews };
        } else {
          console.error('Error: reviews is not an array');
        }
      },

    logout(state) {
        state.reviews = [];
    },
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};
