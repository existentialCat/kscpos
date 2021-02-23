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
        <CollectPayment
          :products="
            !loadtransaction ? chosenProducts : loadtransaction.products
          "
          :services="
            !loadtransaction ? chosenServices : loadtransaction.services
          "
          :balancedue="balanceDue"
          :loadtransaction="loadtransaction"
          :order="order"
          :stage="stage"
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
    stage: {
      type: String,
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
          const format = multiplied.toFixed(2)
          if (p.incart > 0) return (format * 100) / 100
          else {
            const format = p.price.toFixed(2)
            return (format * 100) / 100
          }
        })
        if (subtotal.length > 0) {
          const sum = subtotal.reduce((a, b) => a + b)
          return sum
        } else return 0
      } else return null
    },
    taxesDue() {
      if (this.chosenItems && this.chosenItems.length) {
        const taxes = this.chosenItems.map((p) => {
          if (p.taxable) {
            if (p.incart > 0) {
              const subtotal = p.price * p.incart
              const calculateTax = subtotal * (this.taxrate - 1)
              const format = calculateTax.toFixed(2)
              return (format * 100) / 100
            }
          } else return 0
        })
        if (taxes && taxes.length > 0) {
          const sum = taxes.reduce((a, b) => a + b)
          const format = sum.toFixed(2)
          return format
        } else return 0
      } else return 0
    },
    balanceDue() {
      const formatSubTotal = (this.subtotalDue * 100) / 100
      const formatTaxes = (this.taxesDue * 100) / 100
      const subtotalAndTax = formatSubTotal + formatTaxes
      const formatSum = subtotalAndTax.toFixed(2)
      if (this.loadtransaction && this.loadtransaction.paid) {
        const paidDifference = subtotalAndTax - this.loadtransaction.paid
        const formatSum = paidDifference.toFixed(2)
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
