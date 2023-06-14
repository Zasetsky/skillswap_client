export default {
  methods: {
    findDeal(request) {
      return this.getAllDeals.find(deal => deal._id === request.dealId);
    },

    findReviewsForPastRequest(request, reviews, currentUser) {
      let senderReview, receiverReview;
        
      if (reviews) {
        senderReview = reviews.find(review => 
          review.sender === currentUser._id && review.swapRequestId === request._id
        );

        receiverReview = reviews.find(review => 
          review.receiver === currentUser._id && review.swapRequestId === request._id
        );
      }

      return {
        senderReview: senderReview ? senderReview.skillRating : false,
        receiverReview: receiverReview ? receiverReview.skillRating : false
      };
    },
  },
}