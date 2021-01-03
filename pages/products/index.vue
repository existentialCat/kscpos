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
      <v-col
        ><v-data-table
          ref="prodtable"
          :items="products"
          :search="search"
          :headers="headers"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field
            ><v-row align="center" class="pa-4"
              >Filter:
              <v-chip
                class="ma-1"
                :color="!filterKeywords.length ? 'primary' : ''"
                @click="filterKeywords = []"
                >All</v-chip
              ><v-chip
                v-for="keyword in keywords"
                :key="keyword._id"
                class="ma-1"
                :color="filterKeywords.includes(keyword) ? 'primary' : ''"
                @click="addToFilter(keyword)"
                >{{ keyword.name }}</v-chip
              ></v-row
            ></template
          >
          <template v-slot:item.keywords="{ item }">
            <v-chip v-for="keyword in item.keywords" :key="keyword._id" small>
              {{ keyword.name }}
            </v-chip>
          </template>
          <template v-slot:item.price="{ item }">
            <b>${{ item.price }}</b>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn text small @click="$router.push(`/products/${item._id}`)">
              Open
            </v-btn>
          </template>
          <template v-slot:no-results
            >Product not found.
            <v-dialog v-model="addProduct" persistent max-width="1000px">
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="prodName = search"
                  >Add as New</v-btn
                ></template
              >
              <CreateProduct
                :productname="search"
                @postProd="postProduct"
                @cancelAdd="addProduct = false"
              ></CreateProduct> </v-dialog
          ></template>
          <template v-slot:no-data
            >No inventory.
            <v-dialog v-model="addProduct" persistent max-width="1000px">
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="prodName = search"
                  >Add as New</v-btn
                ></template
              >
              <CreateProduct
                :productname="search"
                @postProd="postProduct"
                @cancelAdd="addProduct = false"
              ></CreateProduct> </v-dialog
          ></template> </v-data-table
      ></v-col>
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
    postProduct(prod) {
      const product = {
        name: prod.name,
        vendor: prod.vendor,
        keywords: prod.keywords,
        brand: prod.brand,
        model: prod.model,
        sn: prod.sn,
        cost: prod.cost,
        price: prod.price,
        qty: prod.qty,
      }
      this.addProduct = false
      this.createProduct(product)
    },
    addToFilter(k) {
      if (this.filterKeywords.includes(k)) {
        const index = this.filterKeywords.indexOf(k)
        return this.filterKeywords.splice(index, 1)
      }
      this.filterKeywords.push(k)
    },
    ...mapActions(['fetchProducts', 'fetchKeywords', 'createProduct']),
  },
}
</script>

<style lang="scss" scoped></style>
