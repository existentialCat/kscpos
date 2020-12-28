<template>
  <v-container>
    <h2>Customers</h2>
    <v-btn text @click="customerForm = !customerForm">{{
      customerForm ? 'Cancel' : 'Add Customer'
    }}</v-btn>
    <v-card v-if="customerForm" max-width="400">
      <v-container>
        <v-text-field
          v-model="newCustomer.fullName"
          label="full name"
        ></v-text-field>
        <v-text-field v-model="newCustomer.phone" label="phone"></v-text-field>
        <v-text-field
          v-model="newCustomer.address"
          label="address"
        ></v-text-field>
        <v-text-field v-model="newCustomer.city" label="city"></v-text-field>
        <v-text-field v-model="newCustomer.state" label="state"></v-text-field>
        <v-text-field v-model="newCustomer.zip" label="zip"></v-text-field>
        <v-btn :disabled="!isValid" @click="saveCustomer()">Save</v-btn>
      </v-container>
    </v-card>
    <v-row justify="center" align="center">
      <v-row>
        <v-data-table :items="customers" :headers="headers"></v-data-table>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'auth',
  components: {},
  async fetch({ store }) {
    return await store.dispatch('fetchAllCustomers')
  },
  data() {
    return {
      isValid: true,
      customerForm: false,
      newCustomer: {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      },
      headers: [
        {
          text: 'Full Name',
          align: 'start',
          sortable: true,
          value: 'fullName',
        },
        { text: 'Phone', value: 'phone' },
      ],
    }
  },
  computed: {
    ...mapState(['customers']),
  },
  methods: {
    async saveCustomer() {
      await this.$axios.post('/api/customers', this.newCustomer)
      this.$router.go()
    },
  },
}
</script>
