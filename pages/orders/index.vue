<template>
  <v-container>
    <h2>All Orders</h2>
    <v-data-table :items="orders" :headers="headers">
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
        <v-btn text small nuxt :to="'/orders/' + item._id">Open</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'auth',
  components: {},
  async fetch({ store }) {
    return await store.dispatch('fetchAllOrders')
  },
  data() {
    return {
      headers: [
        { text: 'Customer Name', value: 'customer.fullName' },
        { text: 'Created', value: 'created' },
        { text: 'Completed', value: 'completed' },
        { text: 'Systems', value: 'systems' },
        { text: 'Transaction', value: 'transaction' },
        { text: 'Action', value: '_id' },
      ],
    }
  },
  computed: {
    ...mapState(['orders']),
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
  },
}
</script>
