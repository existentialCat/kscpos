<template>
  <div>Home <v-btn nuxt to="/orders">Orders</v-btn></div>
</template>

<script>
export default {
  created() {
    this.$router.push('/orders')
  },
}
</script>

<style lang="scss" scoped></style>
