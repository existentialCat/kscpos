<template>
  <div>
    {{ transaction }}<v-btn @click="print()">Print</v-btn>
    <v-card id="printMe" class="printMe">
      <v-card-text style="font-family: 'Roboto'">
        <v-container>
          <v-row><h1 style="margin: auto">Invoice</h1></v-row>
          <v-row
            ><v-img
              contain
              max-width="250px"
              src="/logo.png"
              style="margin: auto"
            ></v-img
          ></v-row>
          <v-row
            ><p style="margin: auto">
              5220 Lewis Ave. Toledo Ohio 43612
            </p></v-row
          >
          <v-row><p style="margin: auto">419-214-0222</p></v-row>
          <v-row><p style="margin: auto">KeithStoneComputers.com</p></v-row>
          <v-row
            ><p v-if="transaction._id" style="margin: auto">
              {{
                transaction._id.substr(transaction._id.length - 7).toUpperCase()
              }}
            </p></v-row
          >
          <v-row
            ><v-col cols="12"
              ><v-card outlined>
                <v-container>
                  <v-row
                    ><v-col v-if="transaction.customer"
                      ><v-row
                        ><v-col
                          >Customer's Name:
                          <b>{{ transaction.customer.fullName }}</b></v-col
                        ></v-row
                      ><v-row
                        ><v-col
                          >Phone Number:
                          <b>{{ transaction.customer.phone }}</b></v-col
                        ></v-row
                      ></v-col
                    ><v-col v-if="transaction.created !== transaction.completed"
                      >Created Date:
                      <b>
                        {{ new Date(transaction.created).toLocaleString() }}</b
                      ></v-col
                    ><v-col v-if="transaction.completed"
                      >Completion Date:
                      <b>
                        {{
                          new Date(transaction.completed).toLocaleString()
                        }}</b
                      ></v-col
                    ></v-row
                  >
                </v-container>
              </v-card></v-col
            ></v-row
          >
          <v-row v-if="transaction.order && transaction.order.finalNote"
            ><v-col cols="12"
              ><v-card outlined>
                <v-container>
                  <v-row
                    ><v-col
                      >Repair Notes:
                      <b>{{ transaction.order.finalNote }}</b></v-col
                    ></v-row
                  >
                </v-container>
              </v-card></v-col
            ></v-row
          >
          <v-row v-if="productsServices"
            ><v-col cols="12"
              ><v-card outlined>
                <v-data-table
                  :headers="transHeader"
                  :items="productsServices"
                  hide-default-footer
                >
                  <template v-slot:item.price="{ item }">
                    <b>${{ item.price }}</b>
                  </template>
                </v-data-table>
              </v-card></v-col
            ></v-row
          >
          <v-row v-if="productsServices" style="margin: auto"
            ><v-spacer /><v-col
              ><v-row
                ><v-col cols="4">Subtotal</v-col
                ><v-col cols="2"
                  ><b>${{ transaction.subtotal }}</b></v-col
                ></v-row
              ><v-row
                ><v-col cols="4">Taxes</v-col
                ><v-col cols="2"
                  ><b>${{ transaction.taxes }}</b></v-col
                ></v-row
              ><v-row
                ><v-col cols="4">Invoice Total</v-col
                ><v-col cols="2"
                  ><b
                    >${{
                      parseFloat(
                        transaction.taxes + transaction.subtotal,
                      ).toFixed(2)
                    }}</b
                  ></v-col
                ></v-row
              ><v-row
                ><v-col cols="4">Paid</v-col
                ><v-col cols="2"
                  ><b
                    >${{
                      transaction.paid > transaction.balanceDue
                        ? parseFloat(
                            transaction.taxes + transaction.subtotal,
                          ).toFixed(2)
                        : 0
                    }}</b
                  ></v-col
                ></v-row
              ><v-row
                ><v-col cols="4">Balance Due</v-col
                ><v-col cols="2"
                  ><b
                    >${{
                      transaction.balanceDue > 0 ? transaction.balanceDue : 0
                    }}</b
                  ></v-col
                ></v-row
              ></v-col
            ></v-row
          >
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      transHeader: [
        { text: 'Description', value: 'name' },
        { text: 'Price', value: 'price' },
      ],
    }
  },
  computed: {
    productsServices() {
      if (this.transaction.products && this.transaction.services) {
        return this.transaction.products.concat(this.transaction.services)
      } else return null
    },
    ...mapState(['transaction']),
  },
  mounted() {
    this.fetchTransaction(this.$route.params.id)
  },
  methods: {
    print() {
      this.printMode = true
      setTimeout(() => {
        this.$htmlToPaper('printMe')
        this.printMode = false
      }, 1000)
    },
    ...mapActions(['fetchTransaction']),
  },
}
</script>

<style lang="css">
.printMe {
  font-family: 'Roboto';
}
</style>
