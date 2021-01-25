<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          slot="collect"
          color="primary"
          :disabled="balancedue === '0.00'"
          v-bind="attrs"
          v-on="on"
          @click="startCollect"
          >Collect Payment</v-btn
        >
      </template>
      <v-card v-if="!paidinfull && !partialpay">
        <v-card-title class="headline grey lighten-2">
          Collect ${{ balancedue }}
        </v-card-title>
        <v-card-text class="py-2">
          <v-container>
            <v-row
              ><v-col
                ><v-btn x-small text @click="setExactChange"
                  >Exact Change</v-btn
                ></v-col
              ></v-row
            >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  ref="receiveinput"
                  v-model="fromCustomer"
                  outlined
                  label="Amount Received"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="processPay"> Receive </v-btn>
          <v-btn text @click="dialog = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="partialpay">
        <v-card-title>Pending Order - Product Stays with us</v-card-title>
        <v-card-text
          ><v-container
            ><v-row>
              <v-col cols="12"
                ><h4>Customer's money down: ${{ fromCustomer }}</h4>
                <h2>
                  KEEP UNPAID PRODUCT - Customer's remaining balance: ${{
                    parseFloat(balancedue - fromCustomer).toFixed(2)
                  }}
                </h2></v-col
              >
              <v-card-actions>
                <v-btn color="primary">Print Invoice and Save</v-btn
                ><v-btn text color="error" @click="partialpay = false"
                  >Go Back</v-btn
                ></v-card-actions
              ></v-row
            ></v-container
          ></v-card-text
        >
      </v-card>
      <v-card v-if="paidinfull">
        <v-card-title>Complete Order</v-card-title>
        <v-card-text
          ><v-container
            ><v-row>
              <v-col v-if="change > 0" cols="12"
                ><h4>Customer Owes: ${{ balancedue }}</h4></v-col
              >
              <v-col v-if="change > 0" cols="12"
                ><h4>Customer Handed you: ${{ fromCustomer }}</h4></v-col
              ><v-col v-if="change > 0" cols="12"
                ><h2>Give change: ${{ change }}</h2></v-col
              ><v-col
                ><v-btn color="primary" @click="saveTransaction"
                  >Print Invoice and Save</v-btn
                ><v-btn text color="error" @click="paidinfull = false"
                  >Go Back</v-btn
                ></v-col
              ></v-row
            ></v-container
          ></v-card-text
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    products: {
      type: Array,
      default: null,
    },
    services: {
      type: Array,
      default: null,
    },
    balancedue: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      partialpay: false,
      fromCustomer: null,
      paymentType: null,
      dialog: false,
      change: null,
      paidinfull: false,
      transactionToPost: {},
    }
  },
  computed: {
    transactionContext() {
      if (this.$route.fullPath === '/quicksale') {
        return 'quick-sale'
      } else return null
    },
  },
  methods: {
    setExactChange() {
      this.fromCustomer = this.balancedue
    },
    startCollect() {
      setTimeout(() => {
        this.$refs.receiveinput.focus()
      }, 100)
    },
    putMoneyDown() {
      this.partialpay = true
      console.log(
        'print out remaining balance owed and keep the system until paid off',
      )
    },
    processPay() {
      if (this.fromCustomer >= this.balancedue) {
        this.paidinfull = true
        console.log(this.transactionContext)
        this.change = parseFloat(this.fromCustomer - this.balancedue).toFixed(2)
        this.transactionToPost.context = this.transactionContext
        this.transactionToPost.products = this.products
        this.transactionToPost.services = this.services
        this.transactionToPost.paid = this.fromCustomer
        console.log(this.transactionToPost)
      } else {
        this.putMoneyDown()
        console.log('unpaid, money put down')
      }
    },
    async saveTransaction() {
      await this.createTransaction(this.transactionToPost).then((res) => {
        // console.log(res)
        this.$router.push(`/transactions/${res._id}`)
      })
    },
    ...mapActions(['createTransaction']),
  },
}
</script>

<style lang="scss" scoped></style>
