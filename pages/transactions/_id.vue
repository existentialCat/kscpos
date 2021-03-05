<template>
  <div>
    {{ transaction }}<v-btn @click="print()">Print</v-btn>
    <v-card id="printMe">suh</v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['transaction']),
  },
  mounted() {
    this.fetchTransaction(this.$route.params.id)
  },
  methods: {
    print() {
      this.printMode = true
      setTimeout(() => {
        this.$htmlToPaper('printMe')
        this.printMode = false
      }, 1000)
    },
    ...mapActions(['fetchTransaction']),
  },
}
</script>

<style lang="scss" scoped></style>
