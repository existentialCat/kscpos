<template>
  <v-container>
    <v-combobox
      v-model="select"
      label="Product[s]"
      chips
      :items="products"
      hide-selected
      item-text="name"
      multiple
    >
      <template v-slot:selection="product">
        <v-chip
          :key="JSON.stringify(product.item.name)"
          v-bind="product.attrs"
          :input-value="product.selected"
          :disabled="product.disabled"
          @click:close="product.parent.selectItem(data.item)"
          >{{
            product.item.name
              ? `${product.item.name} $${product.item.price}`
              : `${select}`
          }}<v-icon small @click="product.parent.selectItem(product.item)">
            mdi-close
          </v-icon></v-chip
        ></template
      ></v-combobox
    >
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      select: null,
    }
  },
  computed: {
    ...mapState(['products', 'product']),
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    ...mapActions(['fetchProducts', 'setProduct']),
  },
}
</script>

<style lang="scss" scoped></style>
