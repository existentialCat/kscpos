<template>
  <div>
    <v-data-table
      :items="customers"
      :search="customerSearch"
      :headers="customerheaders"
      :items-per-page="itemsperpage"
    >
      <template v-slot:top>
        <v-text-field
          v-model="customerSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field
      ></template>
      <template v-slot:item.actions="{ item }">
        <v-btn text small @click="chooseCustomer(item)"> Choose </v-btn>
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
              @click="addCustomer = true"
              >Add as New</v-btn
            ></template
          >
          <CreateCustomer
            :customername="customerSearch"
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
              @click="custName = customerSearch"
              >Add as New</v-btn
            ></template
          >
          <CreateCustomer
            :customername="customerSearch"
            @postCustomer="postCustomer"
            @cancelAdd="addCustomer = false"
          ></CreateCustomer> </v-dialog
      ></template>
    </v-data-table>
    <v-container>
      <v-row>
        <v-spacer />
        <v-btn text small>Wants to remain anonymous</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    itemsperpage: {
      type: [Number, String],
      default: 10,
    },
  },
  data() {
    return {
      customerSearch: '',
      chosenCustomer: {},
      addCustomer: false,
      customerheaders: [
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
    this.fetchAllCustomers()
  },
  methods: {
    chooseCustomer(customer) {
      this.chosenCustomer = customer
      this.$emit('chooseCustomer', this.chosenCustomer)
    },
    postCustomer(cust) {
      const customer = {
        fullName: cust.fullName,
        phone: cust.phone,
      }
      this.addCustomer = false
      this.createCustomer(customer).then((res) => {
        console.log(customer)
        this.chosenCustomer = res
        this.$emit('chooseCustomer', this.chosenCustomer)
      })
    },
    ...mapActions(['fetchAllCustomers', 'createCustomer']),
  },
}
</script>

<style lang="scss" scoped></style>
