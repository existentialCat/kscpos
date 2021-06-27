<template>
  <v-container fluid
    ><v-card
      ><v-card-title
        >Details<v-btn icon @click="editDetails = !editDetails"
          ><v-icon>{{
            !editDetails ? 'mdi-pencil' : 'mdi-close'
          }}</v-icon></v-btn
        ></v-card-title
      ><v-card-text v-if="!editDetails">
        <v-row>
          <v-col>
            {{ upCustomer.fullName }}
          </v-col>
          <v-col>
            {{ upCustomer.phone }}
          </v-col>
          <v-col>
            {{
              upCustomer.address +
              ' ' +
              upCustomer.city +
              ' ' +
              upCustomer.state +
              ' ' +
              upCustomer.zip
            }}
          </v-col>
          <v-col>
            {{ `Tax Exempt? ${upCustomer.taxExempt ? 'Yes' : 'No'}` }}
          </v-col>
          <v-col>
            {{ `Discovered us by: ${upCustomer.discoveredBy}` }}
          </v-col>
        </v-row> </v-card-text
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
          v-model="upCustomer.discoveredBy"
          label="Discovered us by"
          outlined
        ></v-text-field>
        <v-checkbox
          v-model="upCustomer.taxExempt"
          label="Tax Exempt?"
          outlined
        ></v-checkbox></v-card-text
      ><v-card-actions v-if="editDetails"
        ><v-btn color="primary" @click="postUpCustomer()"
          >save</v-btn
        ></v-card-actions
      ></v-card
    ></v-container
  >
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      editDetails: false,
      upCustomer: {
        id: '',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        discoveredBy: '',
        taxExempt: false,
      },
    }
  },
  computed: {
    ...mapState(['customer']),
  },
  mounted() {
    this.fetchCustomer(this.$route.params.id).then(() => {
      this.upCustomer = Object.assign({}, this.customer)
    })
  },
  methods: {
    postUpCustomer() {
      this.updateCustomer(this.upCustomer).then(() => {
        this.editDetails = false
      })
    },
    ...mapActions(['fetchCustomer', 'updateCustomer']),
  },
}
</script>

<style lang="scss" scoped></style>
