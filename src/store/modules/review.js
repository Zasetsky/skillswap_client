import axios from 'axios';
import { getSocket } from "../../soket";

const API_URL = 'http://localhost:3000/api/reviews'

const state = {
    reviews: {},
    dealReviews: [],
}

const getters = {
    getUserReviews: (state) => (userId) => state.reviews[userId] || [],

    getCurrentDealReviews: (state) => state.dealReviews
}

const actions = {
  createReview(context, reviewData) {
    const socket = getSocket();

    socket.emit('createReview', reviewData);

    socket.on('error', error => {
      console.error('Error creating review:', error.message);
    });
  },

  listenCreateReview({ commit }) {
    const socket = getSocket();

    socket.on('reviewCreated', review => {
      commit('ADD_REVIEW_TO_EXISTING_REVIEWS', review);
    });
    console.log('reviewRecieved');
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
  ADD_REVIEW_TO_EXISTING_REVIEWS(state, review) {
    const userId = review.receiver;

    if (!state.reviews[userId]) {
      state.reviews = { ...state.reviews, [userId]: [review] };
    } else {
      const existingReviewIndex = state.reviews[userId].findIndex(
        (r) => r._id === review._id
      );

      if (existingReviewIndex === -1) {
        state.reviews[userId].push(review);
      } else {
        state.reviews[userId][existingReviewIndex] = review;
      }
    }
  },

  SET_USER_REVIEWS(state, { userId, reviews }) {
      if (Array.isArray(reviews)) {
        state.reviews = { ...state.reviews, [userId]: reviews };
      } else {
        console.error('Error: reviews is not an array');
      }
    },

    SET_CURRENT_DEAL_REVIEWS(state, reviews) {
      state.dealReviews = reviews;
    },

  logout(state) {
      state.reviews = {};
      state.dealReviews = [];
  },
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};
