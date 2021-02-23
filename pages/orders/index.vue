<template>
  <v-container>
    <v-row>
      <h2>Work Bench Orders</h2>
      <v-spacer /><CreateOrder></CreateOrder
    ></v-row>
    <v-data-table :items="openorders" :headers="headers">
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
    <h2>Completed</h2>
    <v-data-table :items="completedorders" :headers="headers">
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
      headers: [
        { text: 'Customer Name', value: 'customer.fullName' },
        { text: 'Created', value: 'created' },
        { text: 'Picked Up', value: 'completed' },
        { text: 'Systems', value: 'systems' },
        { text: 'Transaction', value: 'transaction' },
        { text: 'Action', value: '_id' },
      ],
    }
  },
  computed: {
    openorders() {
      return this.orders.filter((o) => {
        return !o.completed
      })
    },
    completedorders() {
      return this.orders.filter((o) => {
        return o.completed
      })
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
        return 'Balance Due: $' + transaction.balanceDue
      } else return 'Completed'
    },
    ...mapActions(['fetchAllOrders']),
  },
}
</script>
