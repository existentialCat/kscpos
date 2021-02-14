<template>
  <v-container>
    <v-card
      ><v-card-title
        >{{ order.customer.fullName }} - {{ order.customer.phone }}
        <v-spacer v-if="!fullView" /><v-btn
          v-if="!fullView"
          nuxt
          :to="'/orders/' + order._id"
          >Open</v-btn
        ></v-card-title
      ><v-card-text>
        <v-row>
          <v-col cols="12">
            <h2>Systems</h2>
          </v-col>
          <v-col v-for="system in order.systems" :key="system.id">
            <v-card
              ><v-card-title>{{
                `${system.brand} - ${system.model}`
              }}</v-card-title></v-card
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12"><h2>Check in Symptoms</h2></v-col
          ><v-col>
            <v-card
              ><v-card-title>{{ order.symptoms }}</v-card-title></v-card
            ></v-col
          >
          <v-col cols="12">
            <h3>
              Notes<v-btn v-if="fullView" icon @click="noteDialog = true"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </h3>
          </v-col>
          <v-col v-for="note in order.notes" :key="note.id">
            <NoteObj :note="note"></NoteObj>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog v-model="repairDialog" persistent max-width="1000">
            <template v-slot:activator="{ on, attrs }">
              <v-col cols="12">
                <h3>
                  Repair Options<v-btn
                    v-if="fullView"
                    icon
                    v-bind="attrs"
                    :on="on"
                    @click="repairDialog = true"
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </h3>
              </v-col>
            </template>
            <v-card>
              <v-card-title class="headline">
                Choose products and services needed
              </v-card-title>
              <v-card-text>
                <!-- Change below to component which displays table and allows for on the go additions -->
                <ProductSelect :itemsperpage="3"></ProductSelect>
                <ServiceSelect></ServiceSelect>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="repairDialog = false"> Cancel </v-btn>
                <v-btn text @click="repairDialog = false"> Add </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-col v-for="estimate in order.estimations" :key="estimate.id">
            <EstimateObj :estimate="estimate"></EstimateObj>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3>
              Contacts Made
              <v-btn v-if="fullView" icon><v-icon>mdi-plus</v-icon></v-btn>
            </h3>
          </v-col>
          <v-col v-for="contact in order.contacts" :key="contact.id">
            <ContactObj :contact="contact"></ContactObj>
          </v-col>
        </v-row> </v-card-text
      ><v-card-actions> </v-card-actions></v-card
  ></v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async fetch({ store, params }) {
    return await store.dispatch('fetchOrder', params.id)
  },
  // middleware: 'auth',
  data() {
    return {
      noteDialog: false,
      noteText: '',
      repairDialog: false,
      repairOptions: [],
      repairProducts: [],
      repairServices: [],
      contactDialog: false,
      contactText: '',
    }
  },
  computed: {
    fullView() {
      if (this.$route.params.id === this.order._id) return true
      return false
    },
    ...mapState(['order']),
  },
}
</script>
