<template>
  <v-container>
    <v-card
      ><v-card-title>{{ note.text }}</v-card-title></v-card
    >
  </v-container>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
