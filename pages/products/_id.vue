<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="1">
          <v-card-title
            >{{ nameEdit ? '' : product.name
            }}<v-text-field
              v-if="nameEdit"
              ref="name"
              v-model="newName"
            ></v-text-field
          ></v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <b>Brand: </b>
                {{ nameEdit ? '' : `${product.brand}` }}
                <v-text-field v-if="nameEdit" v-model="newBrand"></v-text-field>
              </v-col>
              <v-col>
                <b>Model: </b>
                {{ nameEdit ? '' : `${product.model}` }}
                <v-text-field v-if="nameEdit" v-model="newModel"></v-text-field>
              </v-col>
              <v-col>
                <b>SN: </b>
                {{ nameEdit ? '' : `${product.sn}` }}
                <v-text-field v-if="nameEdit" v-model="newSn"></v-text-field>
              </v-col>
              <v-spacer /><v-btn
                v-if="nameEdit"
                text
                small
                @click="updateProd('name')"
                >Save</v-btn
              ><v-btn text small @click="editName">{{
                nameEdit ? 'Close' : 'Edit'
              }}</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4">
        <v-card elevation="1">
          <v-card-title>Keywords</v-card-title>
          <v-card-text>
            <v-col v-for="keyword in product.keywords" :key="keyword._id">{{
              keyword.name
            }}</v-col>
            <v-row v-if="keywordsEdit">
              <v-col v-if="keywordsEdit">
                <v-combobox
                  v-model="newKeywords"
                  :items="keywords"
                  item-text="name"
                  label="Keywords"
                  multiple
                  outlined
                  dense
                ></v-combobox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-btn v-if="keywordsEdit" text small @click="updateProd('keywords')"
            >Save</v-btn
          >
          <v-btn text small @click="editKeywords">{{
            keywordsEdit ? 'Close' : 'Change or Add'
          }}</v-btn>
        </v-card>
      </v-col>
      <v-col lg="2">
        <v-card elevation="1">
          <v-card-title>Vendor</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>{{ product.vendor }}</v-col>
            </v-row>
          </v-card-text>
          <v-btn text small>Edit</v-btn>
        </v-card>
      </v-col>
      <v-col lg="2">
        <v-card elevation="1">
          <v-card-title>Our Cost</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>${{ product.cost }}</v-col>
            </v-row>
          </v-card-text>
          <v-btn text small>Edit</v-btn>
        </v-card>
      </v-col>
      <v-col lg="2">
        <v-card elevation="1">
          <v-card-title>Sale Price</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>${{ product.price }}</v-col>
            </v-row>
          </v-card-text>
          <v-btn text small>Edit</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      nameEdit: false,
      keywordsEdit: false,
      vendorEdit: false,
      costEdit: false,
      priceEdit: false,
      qtyEdit: false,
      newName: '',
      newBrand: '',
      newModel: '',
      newSn: '',
      newKeywords: [],
      newVendor: '',
      newCost: '',
      newPrice: '',
      newQty: '',
    }
  },
  computed: {
    ...mapState(['product', 'keywords']),
  },
  mounted() {
    this.fetchKeywords()
    return this.fetchProduct(this.$route.params.id)
  },
  methods: {
    editName() {
      if (this.nameEdit) return (this.nameEdit = false)
      this.nameEdit = true
      this.$nextTick(() => this.$refs.name.focus())
      this.newName = this.product.name
      this.newBrand = this.product.brand
      this.newModel = this.product.model
      this.newSn = this.product.sn
    },
    editKeywords() {
      if (this.keywordsEdit) return (this.keywordsEdit = false)
      this.keywordsEdit = true
      // this.$nextTick(() => this.$refs.name.focus())
      this.newKeywords = this.product.keywords
    },
    updateProd(field) {
      if (field === 'name') {
        const prod = {
          _id: this.product._id,
          name: this.newName,
          brand: this.newBrand,
          model: this.newModel,
          sn: this.newSn,
          keywords: this.product.keywords,
          vendor: this.product.vendor,
          cost: this.product.cost,
          price: this.product.price,
          qty: this.product.qty,
        }
        this.nameEdit = false
        return this.updateProduct(prod)
      }
      if (field === 'keywords') {
        const prod = {
          _id: this.product._id,
          name: this.product.name,
          brand: this.product.brand,
          model: this.product.model,
          sn: this.product.sn,
          keywords: this.newKeywords,
          vendor: this.product.vendor,
          cost: this.product.cost,
          price: this.product.price,
          qty: this.product.qty,
        }
        this.keywordsEdit = false
        return this.updateProduct(prod)
      }
      if (field === 'vendor') {
        const prod = {
          _id: this.product._id,
          name: this.product.name,
          brand: this.product.brand,
          model: this.product.model,
          sn: this.product.sn,
          keywords: this.product.keywords,
          vendor: this.newVendor,
          cost: this.product.cost,
          price: this.product.price,
          qty: this.product.qty,
        }
        this.vendorEdit = false
        return this.updateProduct(prod)
      }
      if (field === 'cost') {
        const prod = {
          _id: this.product._id,
          name: this.product.name,
          brand: this.product.brand,
          model: this.product.model,
          sn: this.product.sn,
          keywords: this.product.keywords,
          vendor: this.product.vendor,
          cost: this.newCost,
          price: this.product.price,
          qty: this.product.qty,
        }
        this.costEdit = false
        return this.updateProduct(prod)
      }
      if (field === 'price') {
        const prod = {
          _id: this.product._id,
          name: this.product.name,
          brand: this.product.brand,
          model: this.product.model,
          sn: this.product.sn,
          keywords: this.product.keywords,
          vendor: this.product.vendor,
          cost: this.product.cost,
          price: this.newPrice,
          qty: this.product.qty,
        }
        this.priceEdit = false
        return this.updateProduct(prod)
      }
      if (field === 'qty') {
        const prod = {
          _id: this.product._id,
          name: this.product.name,
          brand: this.product.brand,
          model: this.product.model,
          sn: this.product.sn,
          keywords: this.product.keywords,
          vendor: this.product.vendor,
          cost: this.product.cost,
          price: this.product.price,
          qty: this.newQty,
        }
        this.qtyEdit = false
        return this.updateProduct(prod)
      }
    },
    ...mapActions(['fetchProduct', 'fetchKeywords', 'updateProduct']),
  },
}
</script>

<style lang="scss" scoped></style>
