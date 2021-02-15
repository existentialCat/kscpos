<template>
  <v-container>
    <h2>Products</h2>
    <v-row>
      <v-col><b>Total Products:</b> {{ products.length }}</v-col>
      <v-col v-if="products.length"
        ><b>Total On Hand:</b> {{ computedQuantity }}</v-col
      >
      <v-col v-if="products.length"
        ><b>Cost Price Total:</b> ${{ computedCostTotal }}</v-col
      >
      <v-col v-if="products.length"
        ><b>List Price Total:</b> ${{ computedPriceTotal }}</v-col
      >
    </v-row>
    <v-row>
      <v-col><ProductSelect></ProductSelect></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      search: '',
      addProduct: false,
      filterKeywords: [],
      headers: [
        { text: 'Product', value: 'name' },
        {
          text: 'Keywords',
          value: 'keywords',
          filter: (value) => {
            if (!this.filterKeywords.length) return true
            if (!value.length) return false
            const valKeywords = value.map((vk) => vk.name)
            const keywords = this.filterKeywords.map((k) => k.name)
            for (const i in valKeywords) {
              if (keywords.includes(valKeywords[i])) return true
            }
          },
          sortable: false,
        },
        { text: 'Brand', value: 'brand' },
        // { text: 'Vendor', value: 'vendor' },
        { text: 'Cost', value: 'cost' },
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    computedQuantity() {
      const onlyQty = this.products.map((p) => p.qty)
      const total = onlyQty.reduce((a, b) => {
        return a + b
      })
      return total
    },
    computedCostTotal() {
      const onlyCost = this.products.map((p) => {
        if (p.qty <= 1) return p.cost
        else return p.qty * p.cost
      })
      const total = onlyCost.reduce((a, b) => {
        return a + b
      })
      return total
    },
    computedPriceTotal() {
      const onlyPrice = this.products.map((p) => {
        if (p.qty <= 1) return p.price
        else return p.qty * p.price
      })
      const total = onlyPrice.reduce((a, b) => {
        return a + b
      })
      return total
    },
    ...mapState(['products', 'keywords']),
  },
  mounted() {
    this.fetchKeywords()
    return this.fetchProducts()
  },
  methods: {
    addToFilter(k) {
      if (this.filterKeywords.includes(k)) {
        const index = this.filterKeywords.indexOf(k)
        return this.filterKeywords.splice(index, 1)
      }
      this.filterKeywords.push(k)
    },
    ...mapActions(['fetchProducts', 'fetchKeywords']),
  },
}
</script>

<style lang="scss" scoped></style>
