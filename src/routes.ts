export const routes = {
  request: {
    create: '/request',
    delete: '/request/:id',
    update: '/request/:id',
    get: '/request/:id'
  },
  requests: {
    get: 'requests'
  },
  stats: {
    get: '/stats'
  },
  purchase: {
    create: '/purchase',
    delete: '/purchase/:id',
    update: '/purchase/:id',
    partialUpdate: '/purchase/:id',
    get: '/purchase/:id',
    list: '/purchase/list',
    status: {
      edit: '/purchase/:id/status'
    },
    depositBack: '/purchase/:id/deposit/back',
    fakeFeeBack: '/purchase/:id/fake-fee/back',
    commissionBack: '/purchase/:id/commission/back',
    soldPrice: {
      edit: '/purchase/:id/sold-price'
    }
  }
};
