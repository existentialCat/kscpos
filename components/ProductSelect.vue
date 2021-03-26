<template>
  <div>
    <v-data-table
      ref="prodtable"
      :items="products"
      :search="productSearch"
      :items-per-page="itemsperpage"
      :headers="$route.path == '/products' ? productHeaders : productHeadersMin"
    >
      <template v-slot:top>
        <v-text-field
          v-model="productSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          clearable
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
        >
        <v-card v-if="!showTemplates" outlined>
          <v-card-text>
            <v-row
              ><v-spacer /><v-btn
                x-small
                color="blue lighten-4"
                class="mx-5"
                @click="showTemplates = true"
                >Add By Template</v-btn
              ></v-row
            >
          </v-card-text>
        </v-card>
        <v-card v-if="showTemplates" outlined>
          <v-card-text>
            <v-row
              ><b>Create</b>:
              <v-btn text x-small @click="setupNewProd('desktop')"
                >Desktop</v-btn
              ><v-btn text x-small @click="setupNewProd('laptop')">Laptop</v-btn
              ><v-btn text x-small @click="setupNewProd('special')"
                >Special Ordered Part</v-btn
              ><v-spacer /><v-btn
                text
                x-small
                color="error"
                @click="showTemplates = false"
                >close</v-btn
              ></v-row
            ></v-card-text
          ></v-card
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
        <v-btn
          v-if="$route.path == '/products'"
          text
          small
          @click="$router.push(`/products/${item._id}`)"
          >Open</v-btn
        >
        <v-btn v-else text small @click="addChosenProduct(item)"> Add </v-btn>
      </template>
      <template v-slot:no-results
        >Product not found.
        <v-dialog v-model="addProduct" persistent max-width="1000px">
          <template v-slot:activator="{ on, attrs }"
            ><v-btn small outlined v-bind="attrs" v-on="on"
              >Add as New</v-btn
            ></template
          >
          <CreateProduct
            :productname="productSearch"
            :productkeyword="productKeyword"
            @postProd="postProduct"
            @closeAdd="addProduct = false"
          ></CreateProduct> </v-dialog
      ></template>
    </v-data-table>
    <v-dialog v-model="addProduct" persistent max-width="1000px">
      <CreateProduct
        :key="productSearch"
        :productname="productSearch"
        :productkeyword="productKeyword"
        @postProd="postProduct"
        @closeAdd="addProduct = false"
      ></CreateProduct>
    </v-dialog>
  </div>
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
      productKeyword: null,
      showTemplates: false,
      productSearch: '',
      addProduct: false,
      productHeadersMin: [
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
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      productHeaders: [
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
  created() {
    this.fetchProducts()
    this.clearChosenProducts()
  },
  mounted() {
    this.fetchKeywords()
  },
  methods: {
    setupNewProd(option) {
      if (option === 'desktop') {
        this.productSearch = 'Desktop - '
        this.productKeyword = this.keywords.filter((k) => k.name === 'Tower')[0]
      }
      if (option === 'laptop') {
        this.productSearch = 'Laptop - '
        this.productKeyword = this.keywords.filter(
          (k) => k.name === 'Laptop',
        )[0]
      }
      if (option === 'special') {
        this.productSearch = 'Special Ordered Part - '
        this.productKeyword = null
      }
      this.addProduct = true
    },
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
        taxable: true,
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
