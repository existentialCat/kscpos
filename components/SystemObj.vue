<template>
  <v-container
    ><v-card
      ><v-card-title>{{
        `${system.brand} - ${system.model}`
      }}</v-card-title></v-card
    ></v-container
  >
</template>

<script>
export default {
  props: {
    system: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
