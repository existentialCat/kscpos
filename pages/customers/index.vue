<template>
  <v-container>
    <h2>Customers</h2>
    <v-row>
      <v-col
        ><v-data-table :items="customers" :search="search" :headers="headers">
          <template v-slot:top>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field
          ></template>
          <template v-slot:item.actions="{ item }">
            <v-btn text small @click="$router.push(`/customers/${item._id}`)">
              Open
            </v-btn>
          </template>
          <template v-slot:no-results
            >Customer not found.
            <v-dialog v-model="addCustomer" persistent max-width="1000px">
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="custName = search"
                  >Add as New</v-btn
                ></template
              >
              <CreateCustomer
                :customername="search"
                @postCustomer="postCustomer"
                @cancelAdd="addCustomer = false"
              ></CreateCustomer> </v-dialog
          ></template>
          <template v-slot:no-data
            >No Customers yet.
            <v-dialog v-model="addCustomer" persistent max-width="1000px">
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="custName = search"
                  >Add as New</v-btn
                ></template
              >
              <CreateCustomer
                :customername="search"
                @postCustomer="postCustomer"
                @cancelAdd="addCustomer = false"
              ></CreateCustomer> </v-dialog
          ></template> </v-data-table
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      search: '',
      addCustomer: false,
      headers: [
        { text: 'Customer', value: 'fullName' },
        { text: 'Phone', value: 'phone' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapState(['customers']),
  },
  mounted() {
    return this.fetchAllCustomers()
  },
  methods: {
    postCustomer(cust) {
      const customer = {
        fullName: cust.fullName,
        phone: cust.phone,
      }
      this.addCustomer = false
      this.createCustomer(customer)
    },
    ...mapActions(['fetchAllCustomers', 'createCustomer']),
  },
}
</script>

<style lang="scss" scoped></style>
