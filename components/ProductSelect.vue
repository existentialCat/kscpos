<template>
  <v-data-table
    ref="prodtable"
    :items="products"
    :search="productSearch"
    :items-per-page="itemsperpage"
    :headers="productheaders"
  >
    <template v-slot:top>
      <v-text-field
        v-model="productSearch"
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
      <v-btn text small @click="addChosenProduct(item)"> Add </v-btn>
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
            @click="prodName = productSearch"
            >Add as New</v-btn
          ></template
        >
        <CreateProduct
          :productname="productSearch"
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
            @click="prodName = productSearch"
            >Add as New</v-btn
          ></template
        >
        <CreateProduct
          :productname="productSearch"
          @postProd="postProduct"
          @cancelAdd="addProduct = false"
        ></CreateProduct> </v-dialog
    ></template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    itemsperpage: {
      type: [Number, String],
      default: 10,
    },
  },
  data() {
    return {
      productSearch: '',
      addProduct: false,
      productheaders: [
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
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      filterKeywords: [],
    }
  },
  computed: {
    ...mapState(['products', 'keywords', 'chosenProducts']),
  },
  mounted() {
    this.clearChosenProducts()
    this.fetchProducts()
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
    ...mapActions([
      'fetchProducts',
      'createProduct',
      'fetchKeywords',
      'addChosenProduct',
      'removeChosenProduct',
      'clearChosenProducts',
    ]),
  },
}
</script>

<style lang="scss" scoped></style>
