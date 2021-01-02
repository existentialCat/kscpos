<template>
  <div>
    <v-card>
      <v-card-title class="headline grey lighten-2"> New Product </v-card-title>
      <v-card-text class="py-2">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="prod.name"
                :value="productname"
                outlined
                label="Name"
              ></v-text-field>
            </v-col>
            <!-- change to custom v-combobox for on the go keyword creation -->
            <!-- <v-col lg="3">
          <v-select
            v-model="prod.keywords"
            :items="keywords"
            outlined
            multiple
            item-text="name"
            item-value="_id"
            label="Keywords"
          ></v-select>
        </v-col> -->
            <v-col cols="12" sm="4" lg="3">
              <KeywordSelector
                @updatekeywords="updateKeywords"
              ></KeywordSelector>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.brand"
                outlined
                label="Brand"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.model"
                outlined
                label="Model"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.sn"
                outlined
                label="SN"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.vendor"
                outlined
                label="Vendor"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.cost"
                type="number"
                outlined
                label="cost"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.price"
                type="number"
                outlined
                label="price"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="prod.qty"
                type="number"
                outlined
                label="qty"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="createProduct"> Save </v-btn>
        <v-btn text @click="$emit('cancelAdd')"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    productname: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      prod: {
        name: '',
        vendor: '',
        keywords: [],
        brand: '',
        model: '',
        sn: '',
        cost: null,
        price: null,
        qty: null,
      },
    }
  },
  computed: {
    ...mapState(['keywords']),
  },
  mounted() {
    this.prod.name = this.productname
    return this.fetchKeywords()
  },
  methods: {
    updateKeywords(selected) {
      this.prod.keywords = selected
    },
    createProduct() {
      this.$emit('postProd', this.prod)
    },
    ...mapActions(['fetchKeywords']),
  },
}
</script>

<style lang="scss" scoped></style>
