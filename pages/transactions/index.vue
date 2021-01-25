<template>
  <div>{{ transactions }}</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['transactions']),
  },
  mounted() {
    this.fetchAllTransactions()
  },
  methods: {
    ...mapActions(['fetchAllTransactions']),
  },
}
</script>

<style lang="scss" scoped></style>
