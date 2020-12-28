<template>
  <v-container>
    <v-row>{{ product.name }}</v-row>
    <v-row>${{ product.price }}</v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
