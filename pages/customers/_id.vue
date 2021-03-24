<template>
  <div>{{ customer.fullName }}</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['customer']),
  },
  created() {
    this.fetchCustomer(this.$route.params.id)
  },
  methods: {
    ...mapActions(['fetchCustomer']),
  },
}
</script>

<style lang="scss" scoped></style>
