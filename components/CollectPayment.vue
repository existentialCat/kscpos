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
                <v-form autocomplete="off">
                  <v-text-field
                    ref="receiveinput"
                    v-model="fromCustomer"
                    outlined
                    label="Amount Received"
                    autocomplete="new-password"
                    @keydown.enter="processPay"
                  ></v-text-field>
                </v-form>
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
                <v-btn color="primary" @click="saveTransaction">Save</v-btn
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
                ><v-btn color="primary" @click="saveTransaction">Save</v-btn
                ><v-btn text color="error" @click="paidinfull = false"
                  >Go Back</v-btn
                ></v-col
              ></v-row
            ></v-container
          ></v-card-text
        >
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="order && balancedue <= 0 && !order.completed"
      v-model="pickupDialog"
      persistent
      max-width="1000px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
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
    customer: {
      type: Object,
      default: null,
    },
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
      pickupDialog: false,
    }
  },
  computed: {
    chosenItems() {
      return this.products.concat(this.services)
    },
    transactionContext() {
      if (this.order) {
        return 'work-order'
      } else return 'quick-sale'
    },
  },
  methods: {
    markAsPickedUp() {
      if (this.balancedue <= 0) {
        this.closeWorkOrder(this.$route.params.id).then(() => {
          this.$router.push(`/transactions/${this.order.transaction._id}`)
          console.log('closing')
        })
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
    processPay() {
      const sufficientPay =
        parseInt(this.fromCustomer) >= parseInt(this.balancedue)
      console.log(
        `Does ${this.fromCustomer} cover amount of ${this.balancedue}? ${sufficientPay}`,
      )
      console.log(
        `customer paid ${parseFloat(this.fromCustomer).toFixed(
          2,
        )} of which ${parseFloat(this.balancedue).toFixed(2)} is owed`,
      )
      const difference = parseFloat(this.fromCustomer - this.balancedue)
      console.log(`$${difference} is difference`)
      if (sufficientPay) {
        this.paidinfull = true
        this.change = difference.toFixed(2)
      } else {
        this.partialpay = true
      }
    },
    saveTransaction() {
      if (this.customer) {
        const transaction = {
          paid: this.fromCustomer,
          customer: this.customer,
          products: this.products,
          services: this.services,
          balanceDue: this.balancedue - this.fromCustomer,
          order: this.order,
          stage: this.stage,
        }
        if (!this.order) {
          this.createTransaction(transaction).then((res) => {
            this.$router.push(`/transactions/${res._id}`)
          })
        } else {
          this.payOnWorkOrder(transaction).then((res) => {
            this.$router.push(`/transactions/${res.transaction._id}`)
          })
        }
      }
    },
    ...mapActions(['createTransaction', 'closeWorkOrder', 'payOnWorkOrder']),
  },
}
</script>

<style lang="scss" scoped></style>
