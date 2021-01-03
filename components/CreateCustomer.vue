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
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="customer.phone"
                type="phone"
                outlined
                label="Phone"
              ></v-text-field>
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
      },
    }
  },
  mounted() {
    this.customer.fullName = this.customername
  },
  methods: {
    createCustomer() {
      this.$emit('postCustomer', this.customer)
    },
  },
}
</script>

<style lang="scss" scoped></style>
