<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col v-for="product in estimate.products" :key="product.id">
            <ProductObj :product="product"></ProductObj>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="service in estimate.services" :key="service.id">
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
    estimate: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
