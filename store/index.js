export const strict = false
export const state = () => ({
  orders: [],
  order: {},
  productcats: [],
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
})
export const mutations = {
  ADD_ORDER(state, order) {
    state.orders.push(order)
  },
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_ORDER(state, order) {
    state.order = order
  },
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
  SET_CUSTOMER(state, customer) {
    state.customer = customer
  },
  UPDATE_ORDER(state, upOrder) {
    const index = state.orders.findIndex((order) => order.id === upOrder.id)
    if (index !== -1) state.orders.splice(index, 1, upOrder)
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
  async logout({ commit }) {
    await this.$axios.delete('/api/logout')
    commit('SET_USER', null)
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
    })
  },
  setProduct({ commit, getters }, pid) {
    console.log(pid)
    const product = getters.getProductById(pid)
    console.log(product)
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
}
