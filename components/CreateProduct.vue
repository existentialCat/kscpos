<template>
  <div>
    <v-card>
      <v-card-title class="headline grey lighten-2"> New Product </v-card-title>
      <v-card-text class="py-2">
        <v-text-field
          v-model="prod.name"
          :value="productname"
          outlined
          label="Name"
        ></v-text-field>
        <v-text-field
          v-model="prod.vendor"
          outlined
          label="Vendor"
        ></v-text-field>
        <v-select
          v-model="prod.keywords"
          :items="keywords"
          outlined
          multiple
          item-text="name"
          item-value="_id"
          label="Keywords"
        ></v-select>
        <v-text-field
          v-model="prod.brand"
          outlined
          label="Brand"
        ></v-text-field>
        <v-text-field
          v-model="prod.model"
          outlined
          label="Model"
        ></v-text-field>
        <v-text-field v-model="prod.sn" outlined label="SN"></v-text-field>
        <v-text-field v-model="prod.cost" outlined label="cost"></v-text-field>
        <v-text-field
          v-model="prod.price"
          outlined
          label="price"
        ></v-text-field>
        <v-text-field v-model="prod.qty" outlined label="qty"></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('postProd', prod)">
          Save
        </v-btn>
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
    ...mapActions(['fetchKeywords']),
  },
}
</script>

<style lang="scss" scoped></style>
