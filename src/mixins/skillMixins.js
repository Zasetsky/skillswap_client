export default {
  methods: {
    findDeal(request) {
      return this.getAllDeals.find(deal => deal._id === request.dealId);
    },
  },
}