<template>
  <v-container>
    <v-row>
      <v-col cols="12" :lg="order.transaction ? 8 : 12">
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
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-dialog v-model="noteDialog" persistent max-width="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-col cols="12">
                    <h3>
                      Notes<v-btn
                        v-if="fullView"
                        icon
                        v-bind="attrs"
                        :on="on"
                        @click="noteDialog = true"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </h3>
                  </v-col>
                </template>
                <v-card>
                  <v-card-title class="headline"> Add Note </v-card-title>
                  <v-card-text>
                    <v-textarea
                      v-model="noteText"
                      label="Describe diagnostic results"
                      outlined
                    ></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="noteDialog = false"> Cancel </v-btn>
                    <v-btn text @click="addNote"> Add </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-col
                v-for="note in order.notes"
                :key="note.id"
                cols="12"
                md="6"
                lg="4"
              >
                <NoteObj :note="note"></NoteObj>
              </v-col>
            </v-row>
            <v-divider></v-divider>
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
                  <v-card-text class="pt-5">
                    <v-row>
                      <v-col cols="12" lg="8">
                        <TransactionBuilder :step="step">
                          <h2
                            slot="step1title"
                            style="cursor: pointer"
                            @click="step = 1"
                          >
                            Products
                          </h2>
                          <div slot="step1">
                            <ProductSelect :itemsperpage="3"></ProductSelect>
                          </div>
                          <h2
                            slot="step2title"
                            style="cursor: pointer"
                            @click="step = 2"
                          >
                            Services
                          </h2>
                          <div slot="step2">
                            <ServiceSelect :itemsperpage="3"></ServiceSelect>
                          </div>
                        </TransactionBuilder>
                      </v-col>
                      <v-col cols="12" lg="4">
                        <CartBalance noaction></CartBalance>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="repairDialog = false"> Cancel </v-btn>
                    <v-btn text @click="postRepair()"> Add </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-col v-for="estimate in order.repairOptions" :key="estimate.id">
                <EstimateObj :estimate="estimate"></EstimateObj>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-dialog v-model="contactDialog" persistent max-width="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-col cols="12">
                    <h3>
                      Contact<v-btn
                        v-if="fullView"
                        icon
                        v-bind="attrs"
                        :on="on"
                        @click="contactDialog = true"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </h3>
                  </v-col>
                </template>
                <v-card>
                  <v-card-title class="headline"> Contact </v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="contactReason"
                      label="Reason to call customer"
                      :items="[
                        'Get Approval',
                        'Gather more information',
                        'Ready for pickup',
                      ]"
                    ></v-select>
                    <v-row v-if="contactReason === 'Get Approval'">
                      <!-- <v-col
                        ><v-card @click="chosenRepair = feeDiag"
                          ><v-card-title
                            >No Repair Diag - $20</v-card-title
                          ></v-card
                        ></v-col
                      >
                      <v-col
                        ><v-card @click="chosenRepair = freeDiag"
                          ><v-card-title
                            >Free Diag or Recycle - $0</v-card-title
                          ></v-card
                        ></v-col
                      > -->
                      <!-- <v-col
                        v-for="repairOption in order.repairOptions"
                      ></v-col> -->
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="contactText"
                      label="Optional note from phone call with customer"
                      outlined
                      class="mr-5 mt-5"
                    ></v-text-field>
                    <v-divider vertical></v-divider>
                    <v-btn text @click="contactDialog = false"> Close </v-btn>
                    <v-btn text @click="postTransaction"> Add </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-col v-for="contact in order.contacts" :key="contact.id">
                <ContactObj :contact="contact"></ContactObj>
              </v-col>
            </v-row> </v-card-text
          ><v-card-actions> </v-card-actions
        ></v-card> </v-col
      ><v-col v-if="order.transaction">show transaction here</v-col></v-row
    ></v-container
  >
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      contactDialog: false,
      contactReason: '',
      contactText: '',
      chosenRepair: {},
      addProduct: false,
      addService: false,
      step: 1,
    }
  },
  computed: {
    fullView() {
      if (this.$route.params.id === this.order._id) return true
      return false
    },
    ...mapState(['order', 'chosenProducts', 'chosenServices']),
  },
  methods: {
    postTransaction() {
      const transaction = {
        order: this.$route.params.id,
        products: this.chosenRepair.products,
        services: this.chosenRepair.services,
        context: 'system-check-in',
      }
      this.createOrderTransaction(transaction)
    },
    postRepair() {
      const repairOption = {
        order: this.$route.params.id,
        products: this.chosenProducts,
        services: this.chosenServices,
      }
      this.createRepairOption(repairOption)
      this.clearChosenProducts()
      this.clearChosenServices()
      this.repairDialog = false
    },
    addNote() {
      const note = {
        text: this.noteText,
        order: this.order._id,
      }
      this.createNote(note)
      this.noteText = ''
      this.noteDialog = false
    },
    ...mapActions([
      'createNote',
      'createRepairOption',
      'clearChosenProducts',
      'clearChosenServices',
      'createOrderTransaction',
    ]),
  },
}
</script>
