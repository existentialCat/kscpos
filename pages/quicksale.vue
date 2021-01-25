<template>
  <v-container>
    <h2>Quick Sale</h2>
    <v-row>
      <v-col cols="12" lg="8">
        <v-stepper v-model="step" vertical>
          <v-col>
            <v-stepper-step :complete="step > 1" step="1" @click="step = 1">
              <h4>
                <span class="grey--text">Select Customer:</span>
                <b>{{
                  chosenCustomer.fullName
                    ? `${chosenCustomer.fullName} - ${chosenCustomer.phone}`
                    : ''
                }}</b>
              </h4>
            </v-stepper-step>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-data-table
                  :items="customers"
                  :search="customerSearch"
                  :headers="customerheaders"
                >
                  <template v-slot:top>
                    <v-text-field
                      v-model="customerSearch"
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field
                  ></template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn text small @click=";(chosenCustomer = item), step++">
                      Choose
                    </v-btn>
                  </template>
                  <template v-slot:no-results
                    >Customer not found.
                    <v-dialog
                      v-model="addCustomer"
                      persistent
                      max-width="1000px"
                    >
                      <template v-slot:activator="{ on, attrs }"
                        ><v-btn
                          small
                          outlined
                          v-bind="attrs"
                          v-on="on"
                          @click="custName = customerSearch"
                          >Add as New</v-btn
                        ></template
                      >
                      <CreateCustomer
                        :customername="customerSearch"
                        @postCustomer="postCustomer"
                        @cancelAdd="addCustomer = false"
                      ></CreateCustomer> </v-dialog
                  ></template>
                  <template v-slot:no-data
                    >No Customers yet.
                    <v-dialog
                      v-model="addCustomer"
                      persistent
                      max-width="1000px"
                    >
                      <template v-slot:activator="{ on, attrs }"
                        ><v-btn
                          small
                          outlined
                          v-bind="attrs"
                          v-on="on"
                          @click="custName = customerSearch"
                          >Add as New</v-btn
                        ></template
                      >
                      <CreateCustomer
                        :customername="customerSearch"
                        @postCustomer="postCustomer"
                        @cancelAdd="addCustomer = false"
                      ></CreateCustomer> </v-dialog
                  ></template> </v-data-table
              ></v-stepper-content>
            </v-stepper-items>
            <v-stepper-step :complete="step > 2" step="2">
              <h4>Select Products</h4>
            </v-stepper-step>
            <v-stepper-content step="2"
              ><v-data-table
                ref="prodtable"
                :items="products"
                :search="productSearch"
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
                  <v-chip
                    v-for="keyword in item.keywords"
                    :key="keyword._id"
                    small
                  >
                    {{ keyword.name }}
                  </v-chip>
                </template>
                <template v-slot:item.price="{ item }">
                  <b>${{ item.price }}</b>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn text small @click="addProductToCart(item)">
                    Add
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
                ></template> </v-data-table></v-stepper-content
          ></v-col>
        </v-stepper>
      </v-col>
      <v-col cols="12" lg="4">
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
                      @click="removeFromCart(product)"
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
              <v-card-text
                ><h4>Subtotal: ${{ balanceDue - taxesDue }}</h4>
                <h4>Sales Tax: ${{ taxesDue }}</h4>
                <h2>Balance Due: ${{ balanceDue }}</h2></v-card-text
              ></v-card
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CollectPayment
              :products="chosenProducts.map((p) => p._id)"
              :balancedue="parseFloat(balanceDue).toFixed(2)"
            >
            </CollectPayment>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      step: 1,
      chosenCustomer: {},
      customerSearch: '',
      addCustomer: false,
      customerheaders: [
        { text: 'Customer', value: 'fullName' },
        { text: 'Phone', value: 'phone' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      chosenProducts: [],
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
    balanceDue() {
      const taxedProducts = this.chosenProducts.map((p) => {
        if (p.taxable) {
          const calculated = p.price * p.incart * this.taxrate
          return Math.round(calculated * 100) / 100
        }
      })
      const untaxed = this.chosenProducts.map((p) => {
        if (!p.taxable) {
          return p.price * p.incart
        }
      })
      if (this.chosenProducts.length) {
        const taxedTotal = taxedProducts.reduce((a, b) => {
          return a + b
        })
        const untaxedTotal = untaxed.reduce((a, b) => {
          return a + b
        })
        const rounded = Math.round(taxedTotal * 100) / 100
        if (untaxedTotal) {
          return taxedTotal + untaxedTotal
        } else return parseFloat(rounded).toFixed(2)
      } else return 0
    },
    taxesDue() {
      if (this.chosenProducts.length) {
        const subtotal = this.chosenProducts
          .map((p) => p.price * p.incart)
          .reduce((a, b) => a + b)
        const rounded = Math.round((this.balanceDue - subtotal) * 100) / 100
        return parseFloat(rounded).toFixed(2)
      } else return 0
    },
    ...mapState(['customers', 'products', 'keywords', 'taxrate']),
  },
  mounted() {
    this.fetchKeywords()
    this.fetchProducts()
    return this.fetchAllCustomers()
  },
  methods: {
    removeFromCart(product) {
      const index = this.chosenProducts.indexOf(product)
      if (product.incart > 1) {
        this.chosenProducts[index].incart -= 1
      } else if (product.incart === 1) {
        return this.chosenProducts.splice(index, 1)
      }
    },
    postCustomer(cust) {
      const customer = {
        fullName: cust.fullName,
        phone: cust.phone,
      }
      this.addCustomer = false
      this.createCustomer(customer)
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
    addProductToCart(p) {
      if (!this.chosenProducts.includes(p)) {
        p.incart = 1
        this.chosenProducts.push(p)
      } else {
        const index = this.chosenProducts.indexOf(p)
        this.$nextTick(() => {
          this.chosenProducts[index].incart =
            this.chosenProducts[index].incart + 1
        })
      }
      return this.chosenProducts
    },
    ...mapActions([
      'fetchAllCustomers',
      'createCustomer',
      'fetchKeywords',
      'fetchProducts',
      'createProduct',
    ]),
  },
}
</script>

<style lang="scss" scoped></style>
