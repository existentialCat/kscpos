<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="balancedue > 0 || $route.path == '/quicksale'"
          slot="collect"
          color="primary"
          :disabled="chosenItems.length == 0"
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
    <v-dialog v-model="pickupDialog" persistent max-width="1000px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="balancedue <= 0 && loadtransaction && !order.completed"
          color="primary"
          :disabled="chosenItems.length == 0"
          v-bind="attrs"
          v-on="on"
          @click="pickupDialog = true"
          >Mark as Complete</v-btn
        >
      </template>
      <v-card>
        <v-card-title>Confirm Order Compete</v-card-title>
        <v-card-text>
          Confirm items left have been returned to customer
          <v-row v-if="order">
            <v-col
              v-for="(item, index) in order.itemsLeft"
              :key="index"
              cols="12"
              ><b>{{ item }}</b></v-col
            >
          </v-row>
        </v-card-text>
        <v-card-actions
          ><v-btn @click="markAsPickedUp">Close Work Order</v-btn
          ><v-btn @click="pickupDialog = false">Cancel</v-btn></v-card-actions
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
    loadtransaction: {
      type: Object,
      default: null,
    },
    order: {
      type: Object,
      default: null,
    },
    stage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      jobFinished: false,
      partialpay: false,
      fromCustomer: null,
      paymentType: null,
      dialog: false,
      change: null,
      paidinfull: false,
      transactionToPost: {},
      pickupDialog: false,
    }
  },
  computed: {
    chosenItems() {
      return this.products.concat(this.services)
    },
    transactionContext() {
      if (this.$route.fullPath === '/quicksale') {
        return 'quick-sale'
      } else return 'work-order'
    },
  },
  methods: {
    markAsPickedUp() {
      if (this.balancedue <= 0) {
        this.closeWorkOrder(this.loadtransaction.order).then((res) => {
          this.$router.push('/orders/')
          console.log('closing')
        })
        this.paiddialog = false
      } else console.log('ORDER HASNT BEEN PAID FOR')
    },
    setExactChange() {
      this.fromCustomer = this.balancedue
    },
    startCollect() {
      if (!this.jobFinished) this.jobFinished = true
      if (this.jobFinished) {
        return setTimeout(() => {
          this.$refs.receiveinput.focus()
        }, 100)
      }
    },
    putMoneyDown() {
      this.partialpay = true
      console.log(
        'print out remaining balance owed and keep the system until paid off',
      )
    },
    processPay() {
      const sufficientPay =
        this.fromCustomer >= parseFloat(this.balancedue).toFixed(2)
      const difference = parseFloat(this.fromCustomer - this.balancedue)
      if (sufficientPay) {
        this.paidinfull = true
        this.change = difference.toFixed(2)
        this.transactionToPost.context = this.transactionContext
        this.transactionToPost.products = this.products
        this.transactionToPost.services = this.services
        this.transactionToPost.paid = this.fromCustomer
      } else {
        this.putMoneyDown()
        console.log('unpaid, money put down')
      }
    },
    async saveTransaction() {
      if (this.transactionToPost) {
        if (!this.order) {
          await this.createTransaction(this.transactionToPost).then((res) => {
            console.log(res)
            this.$router.push(`/transactions/${res._id}`)
          })
        } else {
          const transaction = {
            order: this.loadtransaction.order,
            paid: this.fromCustomer,
          }
          await this.payOnWorkOrder(transaction).then((res) => {
            console.log(res)
            this.$router.go(`/orders/${transaction.order}`)
          })
        }
      }
    },
    ...mapActions(['createTransaction', 'closeWorkOrder', 'payOnWorkOrder']),
  },
}
</script>

<style lang="scss" scoped></style>
