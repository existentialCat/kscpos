<template>
  <v-container>
    <v-row>
      <h2>Work Bench Orders</h2>
      <v-spacer /><CreateOrder></CreateOrder
    ></v-row>
    <v-card color="blue" class="my-5">
      <v-card-text>
        <v-data-table
          :items="openOrders"
          :headers="headers"
          hide-default-footer
          :items-per-page="100"
        >
          <template v-slot:item.created="{ item }">
            <span>{{ new Date(item.created).toLocaleString() }}</span>
          </template>
          <template v-slot:item.completed="{ item }">
            <span>{{
              item.completed
                ? new Date(item.completed).toLocaleString()
                : 'False'
            }}</span>
          </template>
          <template v-slot:item.systems="{ item }">
            <span>{{ `${systemsString(item.systems)}` }}</span>
          </template>
          <template v-slot:item.transaction="{ item }">
            <a
              v-if="item.transaction"
              :href="'/transactions/' + item.transaction._id"
              >{{ `${transactionString(item.transaction)}` }}</a
            >
          </template>
          <template v-slot:item._id="{ item }">
            <v-btn color="primary" text small nuxt :to="'/orders/' + item._id"
              >Open</v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <h2>Completed</h2>
    <v-data-table
      :items="completedOrders"
      :headers="completedHeaders"
      dense
      :search="orderSearch"
    >
      <template v-slot:top>
        <v-text-field
          v-model="orderSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field
      ></template>
      <template v-slot:item.created="{ item }">
        <span>{{ new Date(item.created).toLocaleString() }}</span>
      </template>
      <template v-slot:item.completed="{ item }">
        <span>{{
          item.completed ? new Date(item.completed).toLocaleString() : 'False'
        }}</span>
      </template>
      <template v-slot:item.systems="{ item }">
        <span>{{ `${systemsString(item.systems)}` }}</span>
      </template>
      <template v-slot:item.transaction="{ item }">
        <a
          v-if="item.transaction"
          :href="'/transactions/' + item.transaction._id"
          >{{ `${transactionString(item.transaction)}` }}</a
        >
      </template>
      <template v-slot:item._id="{ item }">
        <v-btn color="primary" text small nuxt :to="'/orders/' + item._id"
          >Open</v-btn
        >
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  // middleware: 'auth',
  components: {},
  async fetch({ store }) {
    return await store.dispatch('fetchAllOrders')
  },
  data() {
    return {
      orderSearch: '',
    }
  },
  computed: {
    headers() {
      return [
        { text: 'Customer Name', value: 'customer.fullName' },
        { text: 'Created', value: 'created' },
        { text: 'Systems', value: 'systems' },
        { text: 'Transaction', value: 'transaction' },
        { text: 'Action', value: '_id' },
      ]
    },
    completedHeaders() {
      return [
        { text: 'Customer Name', value: 'customer.fullName' },
        { text: 'Created', value: 'created' },
        { text: 'Picked Up', value: 'completed' },
        {
          text: 'Systems',
          value: 'systems',
          filter: (value) => {
            if (!this.orderSearch) return true
            if (!value.length) return false
            const systemBrands = value.map((sys) => sys.brand)
            if (systemBrands.includes(this.orderSearch)) {
              console.log(systemBrands[0])
              return true
            } else return true
          },
        },
        { text: 'Transaction', value: 'transaction' },
        { text: 'Action', value: '_id' },
      ]
    },
    openOrders() {
      return this.orders.filter((o) => {
        return !o.completed
      })
    },
    completedOrders() {
      const completedOrders = this.orders.filter((o) => {
        return o.completed
      })
      completedOrders.reverse()
      return completedOrders
    },
    ...mapState(['orders']),
  },
  created() {
    this.fetchAllOrders()
  },
  methods: {
    systemsString(systems) {
      return systems.map((s) => s.brand + ' ' + s.model)
    },
    transactionString(transaction) {
      if (!transaction) {
        return 'No Transaction'
      } else if (transaction.balanceDue >= 0) {
        return 'Balance Due: $' + parseFloat(transaction.balanceDue).toFixed(2)
      } else return 'Completed'
    },
    ...mapActions(['fetchAllOrders']),
  },
}
</script>
