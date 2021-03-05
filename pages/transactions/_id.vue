<template>
  <div>
    {{ transaction }}<v-btn @click="print()">Print</v-btn>
    <v-card id="printMe">
      <v-card-title>Invoice</v-card-title>
      <v-card-text>
        <v-container>
          <v-row
            ><v-card outlined>
              <v-container>
                <v-row
                  ><v-col>Customer: {{ transaction.customer }}</v-col></v-row
                >
              </v-container>
            </v-card></v-row
          >
        </v-container>
      </v-card-text>
    </v-card>
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
