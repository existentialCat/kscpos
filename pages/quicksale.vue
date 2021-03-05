<template>
  <v-container>
    <h2>Quick Sale</h2>
    <v-row>
      <v-col cols="12" lg="8">
        <TransactionBuilder :step="step">
          <h2 slot="step1title">
            <span class="grey--text">Select Customer:</span>
            <b>{{
              chosenCustomer.fullName
                ? `${chosenCustomer.fullName} - ${chosenCustomer.phone}`
                : ''
            }}</b>
          </h2>
          <div slot="step1">
            <CustomerSelect
              :itemsperpage="5"
              @chooseCustomer="getChosenCustomer"
            ></CustomerSelect>
          </div>
          <h2 slot="step2title">
            <span class="grey--text">Select Product:</span>
          </h2>
          <div slot="step2">
            <ProductSelect :itemsperpage="5"></ProductSelect>
          </div>
        </TransactionBuilder>
      </v-col>
      <v-col cols="12" lg="4">
        <CartBalance :customer="chosenCustomer"></CartBalance>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      customerSearch: '',
      chosenCustomer: {},
    }
  },
  methods: {
    getChosenCustomer(input) {
      this.step++
      this.chosenCustomer = input
    },
  },
}
</script>

<style lang="scss" scoped></style>
