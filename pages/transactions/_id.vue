<template>
  <div>{{ transaction }}</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['transaction']),
  },
  mounted() {
    console.log(this.$route.params.id)
    this.fetchTransaction(this.$route.params.id)
  },
  methods: {
    ...mapActions(['fetchTransaction']),
  },
}
</script>

<style lang="scss" scoped></style>
