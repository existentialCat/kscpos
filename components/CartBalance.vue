<template>
  <div>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Cart</v-card-title>
          <v-card-text>
            <v-row
              v-for="product in !loadtransaction
                ? chosenProducts
                : loadtransaction.products"
              :key="product._id"
            >
              <v-col v-if="product.incart" cols="2">
                x{{ product.incart }}
              </v-col>
              <v-col>
                {{ product.name }}
              </v-col>
              <v-col> ${{ product.price }} </v-col>
              <v-col v-if="!loadtransaction">
                <v-btn
                  color="error"
                  x-small
                  @click="removeChosenProduct(product)"
                  >Remove</v-btn
                >
              </v-col>
            </v-row>
            <v-row
              v-for="service in !loadtransaction
                ? chosenServices
                : loadtransaction.services"
              :key="service._id"
            >
              <v-col v-if="service.incart" cols="2">
                x{{ service.incart }}
              </v-col>
              <v-col>
                {{ service.name }}
              </v-col>
              <v-col> ${{ service.price }} </v-col>
              <v-col v-if="!loadtransaction">
                <v-btn
                  color="error"
                  x-small
                  @click="removeChosenService(service)"
                  >Remove</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text v-if="chosenProducts"
            ><h4>Subtotal: ${{ subtotalDue }}</h4>
            <h4>Sales Tax: ${{ taxesDue }}</h4>
            <h4 v-if="loadtransaction && loadtransaction.paid">
              Amount Paid: ${{ loadtransaction.paid }}
            </h4>
            <h2>Balance Due: ${{ balanceDue }}</h2></v-card-text
          ></v-card
        >
      </v-col>
    </v-row>
    <v-row v-if="!noaction">
      <v-col>
        <slot name="repairSummary"></slot>
        <CollectPayment
          :products="
            !loadtransaction ? chosenProducts : loadtransaction.products
          "
          :services="
            !loadtransaction ? chosenServices : loadtransaction.services
          "
          :customer="customer"
          :balancedue="balanceDue"
          :loadtransaction="loadtransaction"
          :order="order"
        >
        </CollectPayment>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    noaction: {
      type: Boolean,
      default: false,
    },
    loadtransaction: {
      type: Object,
      default: null,
    },
    order: {
      type: Object,
      default: null,
    },
    customer: {
      type: Object,
      default: null,
    },
  },
  computed: {
    chosenItems() {
      if (!this.loadtransaction) {
        return this.chosenProducts.concat(this.chosenServices)
      } else {
        return this.loadtransaction.products.concat(
          this.loadtransaction.services,
        )
      }
    },
    subtotalDue() {
      if (this.chosenItems) {
        const subtotal = this.chosenItems.map((p) => {
          const multiplied = p.price * p.incart
          if (p.incart > 0) return multiplied
          else {
            return p.price
          }
        })
        if (subtotal.length > 0) {
          const sum = subtotal.reduce((a, b) => a + b)
          return parseFloat(sum).toFixed(2)
        } else return 0
      } else return null
    },
    taxesDue() {
      if (this.chosenItems && this.chosenItems.length) {
        const taxes = this.chosenItems.map((p) => {
          if (p.taxable) {
            if (p.incart > 0) {
              const subtotal = p.price * p.incart
              const calculateTax = subtotal * 0.0725
              console.log(`calculateTax: ${calculateTax}`)
              return parseFloat(calculateTax).toFixed(2)
            }
          } else return 0
        })
        if (taxes && taxes.length > 0) {
          const sum = taxes.reduce((a, b) => a + b)
          return parseFloat(sum).toFixed(2)
        } else return 0
      } else return 0
    },
    balanceDue() {
      console.log(`subtotalDue: ${this.subtotalDue}`)
      console.log(`taxesDue ${this.taxesDue}`)
      const subtotalAndTax =
        parseFloat(this.subtotalDue) + parseFloat(this.taxesDue)
      const formatSum = parseFloat(subtotalAndTax).toFixed(2)
      console.log(`subtotalAndTax subtotal plus taxes: ${subtotalAndTax}`)
      if (this.loadtransaction && this.loadtransaction.paid) {
        const paidDifference = subtotalAndTax - this.loadtransaction.paid
        const formatSum = parseFloat(paidDifference).toFixed(2)
        return formatSum
      } else return formatSum
    },
    ...mapState(['taxrate', 'chosenProducts', 'chosenServices']),
  },
  methods: {
    ...mapActions(['removeChosenProduct', 'removeChosenService']),
  },
}
</script>

<style lang="scss" scoped></style>
