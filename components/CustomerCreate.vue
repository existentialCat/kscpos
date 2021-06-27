<template>
  <div>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        New Customer
      </v-card-title>
      <v-card-text class="py-2">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="customer.fullName"
                :value="customername"
                outlined
                label="Name"
                autocomplete="new-password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="customer.phone"
                type="phone"
                outlined
                label="Phone"
                autocomplete="new-password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-checkbox
                v-model="customer.taxExempt"
                outlined
                label="Tax Exempt?"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="createCustomer"> Save </v-btn>
        <v-btn text @click="$emit('cancelAdd')"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    customername: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      customer: {
        fullName: '',
        phone: '',
        taxExempt: false,
      },
    }
  },
  mounted() {
    this.customer.fullName = this.customername
  },
  methods: {
    createCustomer() {
      const nameArr = this.customer.fullName.split(' ')
      for (const i in nameArr) {
        const name = nameArr[i]
        const letterArr = name.split('')
        letterArr[0] = letterArr[0].toUpperCase()
        const capitalName = letterArr.join('')
        nameArr[i] = capitalName
      }
      const nameString = nameArr.join(' ')
      this.customer.fullName = nameString
      this.$emit('postCustomer', this.customer)
    },
  },
}
</script>

<style lang="scss" scoped></style>
