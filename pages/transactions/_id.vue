<template>
  <div>
    {{ transaction }}<v-btn @click="print()">Print</v-btn>
    <v-card id="printMe" class="printMe">
      <v-card-text style="font-family: 'Roboto'">
        <v-container>
          <v-row><h1 style="margin: auto">Invoice</h1></v-row>
          <v-row
            ><v-img
              contain
              max-width="250px"
              src="/logo.png"
              style="margin: auto"
            ></v-img
          ></v-row>
          <v-row
            ><p style="margin: auto">
              5220 Lewis Ave. Toledo Ohio 43612
            </p></v-row
          >
          <v-row><p style="margin: auto">419-214-0222</p></v-row>
          <v-row><p style="margin: auto">KeithStoneComputers.com</p></v-row>
          <v-row
            ><p v-if="transaction._id" style="margin: auto">
              {{
                transaction._id.substr(transaction._id.length - 7).toUpperCase()
              }}
            </p></v-row
          >
          <v-row
            ><v-col cols="12"
              ><v-card outlined>
                <v-container>
                  <v-row
                    ><v-col v-if="transaction.customer"
                      >Customer's Name:
                      <b>{{ transaction.customer.fullName }}</b></v-col
                    ><v-col
                      >Date:
                      <b>
                        {{
                          new Date(transaction.completed).toLocaleString()
                        }}</b
                      ></v-col
                    ></v-row
                  >
                </v-container>
              </v-card></v-col
            ></v-row
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

<style lang="css">
.printMe {
  font-family: 'Roboto';
}
</style>
