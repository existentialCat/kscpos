<template>
  <div>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Cart</v-card-title>
          <v-card-text>
            <v-row v-for="product in chosenProducts" :key="product._id">
              <v-col v-if="product.incart" cols="2">
                x{{ product.incart }}
              </v-col>
              <v-col>
                {{ product.name }}
              </v-col>
              <v-col> ${{ product.price }} </v-col>
              <v-col>
                <v-btn
                  color="error"
                  x-small
                  @click="removeChosenProduct(product)"
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
            <h2>Balance Due: ${{ balanceDue }}</h2></v-card-text
          ></v-card
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <CollectPayment :products="chosenProducts" :balancedue="balanceDue">
        </CollectPayment>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    subtotalDue() {
      if (this.chosenProducts) {
        const subtotal = this.chosenProducts.map((p) => {
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
      if (this.chosenProducts && this.chosenProducts.length) {
        const taxes = this.chosenProducts.map((p) => {
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
      const sum = formatSubTotal + formatTaxes
      const formatSum = sum.toFixed(2)
      return formatSum
    },
    ...mapState(['taxrate', 'chosenProducts']),
  },
  methods: {
    ...mapActions(['removeChosenProduct']),
  },
}
</script>

<style lang="scss" scoped></style>
