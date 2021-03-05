export default false
export const state = () => ({
  cart: [],
  taxrate: 1.0725,
  orders: [],
  order: {},
  transactions: [],
  transaction: {},
  customers: [],
  customer: {},
  products: [],
  product: {},
  services: [],
  service: {},
  systems: [],
  system: {},
  keywords: [],
  categories: [],
  chosenProducts: [],
  chosenServices: [],
})
export const mutations = {
  SET_CUSTOMERS(state, customers) {
    state.customers = customers
  },
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  ADD_PRODUCT(state, product) {
    state.products.push(product)
  },
  SET_PRODUCT(state, product) {
    state.product = product
  },
  SET_SERVICES(state, services) {
    state.services = services
  },
  SET_SERVICE(state, service) {
    state.service = service
  },
  ADD_SERVICE(state, service) {
    state.services.push(service)
  },
  SET_CUSTOMER(state, customer) {
    state.customer = customer
  },
  ADD_CUSTOMER(state, customer) {
    state.customers.push(customer)
  },
  UPDATE_CUSTOMER(state, upCustomer) {
    const index = state.customers.findIndex(
      (customer) => customer.id === upCustomer.id,
    )
    if (index !== -1) state.customers.splice(index, 1, upCustomer)
  },
  SET_KEYWORDS(state, keywords) {
    state.keywords = keywords
  },
  ADD_KEYWORD(state, keyword) {
    state.keywords.push(keyword)
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_CATEGORY(state, category) {
    state.categories.push(category)
  },
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions
  },
  SET_TRANSACTION(state, transaction) {
    state.transaction = transaction
  },
  CLEAR_TRANSACTION(state) {
    state.transaction = {}
  },
  ADD_TRANSACTION(state, transaction) {
    state.transactions.push(transaction)
  },
  SET_CHOSEN_PRODUCTS(state, products) {
    state.chosenProducts = products
  },
  ADD_CHOSEN_PRODUCT(state, product) {
    if (!state.chosenProducts.includes(product)) {
      product.incart = 1
      state.chosenProducts.push(product)
    } else {
      const index = state.chosenProducts.indexOf(product)
      state.chosenProducts[index].incart =
        state.chosenProducts[index].incart + 1
    }
  },
  REMOVE_CHOSEN_PRODUCT(state, product) {
    const index = state.chosenProducts.indexOf(product)
    if (product.incart > 1) {
      state.chosenProducts[index].incart -= 1
    } else if (product.incart === 1) {
      return state.chosenProducts.splice(index, 1)
    }
  },
  CLEAR_CHOSEN_PRODUCTS(state) {
    state.chosenProducts = []
  },
  ADD_CHOSEN_SERVICE(state, service) {
    if (!state.chosenServices.includes(service)) {
      service.incart = 1
      state.chosenServices.push(service)
    } else {
      const index = state.chosenServices.indexOf(service)
      state.chosenServices[index].incart =
        state.chosenServices[index].incart + 1
    }
  },
  REMOVE_CHOSEN_SERVICE(state, service) {
    const index = state.chosenServices.indexOf(service)
    if (service.incart > 1) {
      state.chosenServices[index].incart -= 1
    } else if (service.incart === 1) {
      return state.chosenServices.splice(index, 1)
    }
  },
  CLEAR_CHOSEN_SERVICES(state) {
    state.chosenServices = []
  },
  SET_CHOSEN_SERVICES(state, services) {
    state.chosenServices = services
  },
  ADD_ORDER(state, order) {
    state.orders.push(order)
  },
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_ORDER(state, order) {
    state.order = order
  },
  UPDATE_ORDER(state, upOrder) {
    const index = state.orders.findIndex((order) => order.id === upOrder.id)
    if (index !== -1) state.orders.splice(index, 1, upOrder)
  },
  UPDATE_ORDER_STATUS(state, status) {
    state.order.status = status
  },
  ADD_NOTE_TO_ORDER(state, note) {
    state.order.notes.push(note)
  },
  ADD_REPAIR_OPTION(state, repair) {
    state.order.repairOptions.push(repair)
  },
  ADD_TRANSACTION_TO_ORDER(state, transaction) {
    state.order.transaction = transaction
  },
}
export const getters = {
  getOrderById: (state) => (id) => {
    return state.orders.find((order) => order.id === id)
  },
  getProductById: (state) => (id) => {
    return state.products.find((product) => product._id === id)
  },
}
export const actions = {
  async createOrder({ commit }, order) {
    return await this.$axios
      .post('/api/orders', order)
      .then((res) => {
        commit('ADD_ORDER', res.data)
        return res.data
      })
      .catch((err) => {
        console.log(err)
      })
  },
  closeWorkOrder({ commit }, id) {
    this.$axios.post(`/orders/${id}/close`).then((res) => {})
  },
  // server returns response transaction
  payOnWorkOrder({ commit }, transaction) {
    transaction.context = 'work-order'
    this.$axios
      .post(`/orders/${transaction.order._id}/pay`, transaction)
      .then((res) => {
        commit('SET_ORDER', res.data)
        return res.data
      })
  },
  createNote({ commit }, note) {
    this.$axios.post(`/orders/${note.order}/note`, note).then((res) => {
      commit('ADD_NOTE_TO_ORDER', res.data)
    })
  },
  createRepairOption({ commit }, repair) {
    this.$axios
      .post(`/orders/${repair.order}/addrepair`, repair)
      .then((res) => {
        commit('ADD_REPAIR_OPTION', res.data)
        commit('UPDATE_ORDER_STATUS', 'needs-approval')
      })
  },
  createOrderTransaction({ commit }, transaction) {
    this.$axios
      .post(`/orders/${transaction.order}/approve`, transaction)
      .then((res) => {
        commit('ADD_TRANSACTION_TO_ORDER', res.data.transaction)
        commit('SET_TRANSACTION', res.data.transaction)
        commit('SET_ORDER', res.data)
      })
  },
  async fetchAllOrders({ commit }) {
    return await this.$axios
      .get('/api/orders')
      .then((res) => {
        commit('SET_ORDERS', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchAllOrders action' + error)
      })
  },
  async fetchWorkbench({ commit }) {
    return await this.$axios
      .get('/api/workbench')
      .then((res) => {
        commit('SET_ORDERS', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchWorkbench action' + error)
      })
  },
  async fetchOrder({ commit }, id) {
    return await this.$axios
      .get('/api/orders/' + id)
      .then((res) => {
        commit('SET_ORDER', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchOrder action' + error)
      })
  },
  setChosenProducts({ commit }, products) {
    commit('SET_CHOSEN_PRODUCTS', products)
  },
  addChosenProduct({ commit }, product) {
    commit('ADD_CHOSEN_PRODUCT', product)
  },
  removeChosenProduct({ commit }, product) {
    commit('REMOVE_CHOSEN_PRODUCT', product)
  },
  clearChosenProducts({ commit }) {
    commit('CLEAR_CHOSEN_PRODUCTS')
  },
  setChosenServices({ commit }, services) {
    commit('SET_CHOSEN_SERVICES', services)
  },
  addChosenService({ commit }, service) {
    commit('ADD_CHOSEN_SERVICE', service)
  },
  removeChosenService({ commit }, service) {
    commit('REMOVE_CHOSEN_SERVICE', service)
  },
  clearChosenServices({ commit }) {
    commit('CLEAR_CHOSEN_SERVICES')
  },
  async fetchKeywords({ commit }) {
    await this.$axios.get('/api/keywords').then((res) => {
      commit('SET_KEYWORDS', res.data)
    })
  },
  async addKeyword({ commit }, keyword) {
    await this.$axios.post('/api/keywords', keyword).then((res) => {
      commit('ADD_KEYWORD', res.data)
    })
  },
  async fetchCategories({ commit }) {
    await this.$axios.get('/api/categories').then((res) => {
      commit('SET_CATEGORIES', res.data)
    })
  },
  async addCategory({ commit }, category) {
    await this.$axios.post('/api/categories', category).then((res) => {
      commit('ADD_CATEGORY', res.data)
    })
  },
  async logout({ commit }) {
    await this.$axios.delete('/api/logout')
    commit('SET_USER', null)
  },
  async fetchProducts({ commit }) {
    return await this.$axios
      .get('/api/products')
      .then((res) => {
        commit('SET_PRODUCTS', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchProducts action' + error)
      })
  },
  async fetchProduct({ commit }, id) {
    return await this.$axios
      .get(`/api/products/${id}`)
      .then((res) => {
        commit('SET_PRODUCT', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchProduct action' + error)
      })
  },
  async updateProduct({ commit }, product) {
    await this.$axios
      .put(`/api/products/${product._id}`, product)
      .then((res) => {
        commit('SET_PRODUCT', res.data)
      })
  },
  async createProduct({ commit }, product) {
    await this.$axios.post('/api/products', product).then((res) => {
      commit('ADD_PRODUCT', res.data)
      return res.data
    })
  },
  setProduct({ commit, getters }, pid) {
    console.log(pid)
    const product = getters.getProductById(pid)
    commit('SET_PRODUCT', product)
  },
  async fetchServices({ commit }) {
    return await this.$axios
      .get('/api/services')
      .then((res) => {
        commit('SET_SERVICES', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchServices action' + error)
      })
  },
  async fetchService({ commit }, id) {
    return await this.$axios
      .get(`/api/services/${id}`)
      .then((res) => {
        commit('SET_SERVICE', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchService action' + error)
      })
  },
  async updateService({ commit }, service) {
    await this.$axios
      .put(`/api/services/${service._id}`, service)
      .then((res) => {
        commit('SET_SERVICE', res.data)
      })
  },
  async createService({ commit }, service) {
    await this.$axios.post('/api/services', service).then((res) => {
      commit('ADD_SERVICE', res.data)
    })
  },
  async fetchAllCustomers({ commit }) {
    return await this.$axios
      .get('/api/customers')
      .then((res) => {
        commit('SET_CUSTOMERS', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on fetchAllCustomers action' + error)
      })
  },
  async createCustomer({ commit }, customer) {
    return await this.$axios
      .post(`/api/customers/`, customer)
      .then((res) => {
        commit('ADD_CUSTOMER', res.data)
        return res.data
      })
      .catch((error) => {
        console.log('failed on createCustomer action' + error)
      })
  },
  async createTransaction({ commit }, transaction) {
    if (!transaction.order) transaction.context = 'quick-sale'
    return await this.$axios
      .post('/api/transactions', transaction)
      .then((res) => {
        commit('ADD_TRANSACTION', res.data)
        return res.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  clearTransaction({ commit }) {
    commit('CLEAR_TRANSACTION')
  },
  async fetchTransaction({ commit }, id) {
    return await this.$axios
      .get(`/api/transactions/${id}`)
      .then((res) => {
        commit('SET_TRANSACTION', res.data)
        return res.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  async fetchAllTransactions({ commit }) {
    return await this.$axios
      .get('/api/transactions')
      .then((res) => {
        commit('SET_TRANSACTIONS', res.data)
        return res.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
