// import axios from 'axios';


// const state = {
//     // Если вам нужны данные отзывов, создайте здесь свойства состояния
// }

// const getters = {
//     // Если вам нужны геттеры для данных отзывов, создайте их здесь
// }

// const actions = {
//     async createReview({ commit }, payload) {
//         try {
//             const response = await axios.post('/api/reviews', payload);
//             const review = response.data.review;

//             // Если вам нужно обновить состояние или вызвать мутацию, сделайте это здесь

//             return { success: true, review };
//         } catch (error) {
//             return { success: false, error: error.response.data.error };
//         }
//     },
// }

// const mutations = {
//     // Если вам нужно мутировать данные отзывов, создайте здесь мутации
// }


// export default {
//     namespaced: true,
//     state,
//     actions,
//     mutations,
//     getters,
// };

// this.$store.dispatch('createReview', {
//     sender: senderId,
//     receiver: receiverId,
//     swapRequestId: swapRequestId,
//     dealId: dealId,
//     skill: skillId,
//     skillRating: skillRating,
//     isLate: isLate,
//     comment: comment,
//   });