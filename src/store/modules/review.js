import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reviews/'


const state = {
    currentReviews: [],
}

const getters = {
    getCurrentDealReviews: (state) => state.currentReviews
}

const actions = {
    async createReview({ commit }, payload) {
        try {
            const response = await axios.post(`${API_URL}/create`, payload);
            const review = response.data.review;

            commit('ADD_REVIEW_TO_CURRENT_DEAL_REVIEWS', review);

        } catch (error) {
            console.error(error.response.data.error);
        }
    },

    async getCurrentDealReviews({ commit }, dealId) {
        try {
            const response = await axios.get(`${API_URL}/deal/${dealId}`);
            const reviews = response.data.reviews;

            commit('SET_CURRENT_DEAL_REVIEWS', reviews);

        } catch (error) {
            console.error(error.response.data.error);
        }
    },
}

const mutations = {
    ADD_REVIEW_TO_CURRENT_DEAL_REVIEWS(state, review) {
        const existingReviewIndex = state.currentReviews.findIndex(
          (r) => r._id === review._id
        );
    
        if (existingReviewIndex === -1) {
          state.currentReviews.push(review);
        }
    },
    SET_CURRENT_DEAL_REVIEWS(state, reviews) {
        state.currentReviews = reviews;
    },
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};