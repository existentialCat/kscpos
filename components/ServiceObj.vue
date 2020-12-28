<template>
  <v-container>
    <v-row>{{ service.name }}</v-row>
    <v-row>${{ service.price }}</v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    service: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
