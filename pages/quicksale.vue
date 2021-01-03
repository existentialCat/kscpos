<template>
  <v-container>
    <h2>Quick Sale</h2>
    <v-row>
      <v-stepper v-model="step" vertical>
        <v-col>
          <v-stepper-step :complete="step > 1" step="1" @click="step = 1">
            <h4>
              <span class="grey--text">Select Customer:</span>
              <b>{{
                chosenCustomer.fullName
                  ? `${chosenCustomer.fullName} - ${chosenCustomer.phone}`
                  : ''
              }}</b>
            </h4>
          </v-stepper-step>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-data-table
                :items="customers"
                :search="customerSearch"
                :headers="headers"
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
                  <v-btn text small @click=";(chosenCustomer = item), step++">
                    Choose
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
                ></template> </v-data-table
            ></v-stepper-content>
          </v-stepper-items>
          <v-stepper-step :complete="step > 2" step="2">
            <h4>Select Products</h4>
          </v-stepper-step>
          <v-stepper-content step="2"></v-stepper-content
        ></v-col>
      </v-stepper>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      step: 1,
      chosenCustomer: {},
      customerSearch: '',
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
