<template>
  <v-container fluid
    ><v-card
      ><v-card-title
        >Details<v-btn icon @click="editCustomer"
          ><v-icon>mdi-pencil</v-icon></v-btn
        ></v-card-title
      ><v-card-text v-if="!editDetails">{{ customer.fullName }}</v-card-text
      ><v-card-text v-if="editDetails"
        ><v-text-field
          v-model="upCustomer.fullName"
          label="Full Name"
          outlined
        ></v-text-field
        ><v-text-field
          v-model="upCustomer.phone"
          label="Phone"
          outlined
        ></v-text-field
        ><v-text-field
          v-model="upCustomer.address"
          label="Address"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="upCustomer.city"
          label="City"
          outlined
        ></v-text-field
        ><v-text-field
          v-model="upCustomer.state"
          label="State"
          outlined
        ></v-text-field
        ><v-text-field
          v-model="upCustomer.zip"
          label="Zip"
          outlined
        ></v-text-field
        ><v-text-field
          v-model="upCustomer.phone"
          label="Discovered us by"
          outlined
        ></v-text-field></v-card-text></v-card
  ></v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      editDetails: false,
      upCustomer: {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        discoveredBy: '',
      },
    }
  },
  computed: {
    ...mapState(['customer']),
  },
  created() {
    this.fetchCustomer(this.$route.params.id)
  },
  methods: {
    editCustomer() {
      this.upCustomer.fullName = this.customer.fullName
      this.editDetails = true
    },
    ...mapActions(['fetchCustomer', 'updateCustomer']),
  },
}
</script>

<style lang="scss" scoped></style>
