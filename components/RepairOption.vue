<template>
  <v-container>
    <v-card :outlined="!chosen" :color="chosen ? 'green lighten-5' : ''">
      <v-card-text>
        <v-row>
          <v-col v-for="product in repairoption.products" :key="product.id">
            <ProductObj :product="product"></ProductObj>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="service in repairoption.services" :key="service.id">
            <ServiceObj :service="service"></ServiceObj>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    repairoption: {
      type: Object,
      required: true,
    },
    chosen: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
