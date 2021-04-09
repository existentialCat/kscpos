<template>
  <div>
    <OrderPrint v-if="printMode" :order="order"></OrderPrint>
    <v-container v-if="order.customer.fullName">
      <v-row>
        <v-btn class="ma-5" x-large @click="print()">Print Checkin Sheet</v-btn>
        <v-btn
          v-if="order.transaction"
          class="ma-5"
          x-large
          @click="$router.push(`/transactions/${order.transaction._id}`)"
          >Go To Invoice</v-btn
        >
      </v-row>
      <v-row>
        <v-col v-if="order.status" cols="12"
          ><v-card
            :color="
              order.status == 'completed' || order.status == 'order-paid-for'
                ? 'primary'
                : ''
            "
            dark
            ><v-card-title>{{ orderStatusPhrase }}</v-card-title></v-card
          ></v-col
        >
        <v-col cols="12" :lg="order.transaction ? 8 : 12">
          <v-card outlined
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
                  <h3>Systems</h3>
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
                <v-col cols="12"><h3>Check in Symptoms</h3></v-col
                ><v-col>
                  <v-card
                    ><v-card-title v-if="!editSymptom" @click="changeSymptom">{{
                      order.symptoms
                    }}</v-card-title
                    ><v-card-text v-if="editSymptom"
                      ><v-textarea
                        ref="symptom"
                        v-model="newSymptom"
                        outlined
                        rows="3"
                      ></v-textarea
                      ><v-btn
                        v-if="editSymptom"
                        x-small
                        @click="editSymptom = false"
                        >cancel</v-btn
                      ><v-btn
                        color="primary"
                        class="ml-3"
                        small
                        :disabled="
                          newSymptom == order.symptoms || newSymptom < 3
                        "
                        @click="updateSymptom"
                        >save</v-btn
                      ></v-card-text
                    ></v-card
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
                          :disabled="order.completed"
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
                      <v-btn text :disabled="order.completed" @click="addNote">
                        Add
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-col
                  v-for="note in order.notes"
                  :key="note._id"
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
                          :disabled="order.completed"
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
                              Services
                            </h2>
                            <div slot="step1">
                              <ServiceSelect :itemsperpage="3"></ServiceSelect>
                            </div>
                            <h2
                              slot="step2title"
                              style="cursor: pointer"
                              @click="step = 2"
                            >
                              Products
                            </h2>
                            <div slot="step2">
                              <ProductSelect :itemsperpage="3"></ProductSelect>
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
                <v-col
                  v-for="(repairoption, index) in order.repairOptions"
                  :key="index"
                >
                  <OrderRepairOption
                    :repairoption="repairoption"
                    :chosen="compareRepairOptionToTransaction(repairoption)"
                  ></OrderRepairOption>
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
                          :disabled="order.completed"
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
                        <v-col
                          v-for="(repairOption, indexA) in order.repairOptions"
                          :key="indexA"
                        >
                          <v-card>
                            <v-card-text
                              v-for="(
                                repair, index
                              ) in repairOption.services.concat(
                                repairOption.products,
                              )"
                              :key="index"
                              >{{
                                `${
                                  repair.incart > 1 ? repair.incart + 'x' : ''
                                } ${repair.name} $${repair.price}`
                              }}</v-card-text
                            >
                            <v-card-text>
                              <v-btn
                                :color="
                                  chosenRepair === repairOption ? 'primary' : ''
                                "
                                @click="chooseRepair(repairOption)"
                                >{{
                                  chosenRepair === repairOption
                                    ? `Selected $${getBalance(repairOption)}`
                                    : `Choose $${getBalance(repairOption)}`
                                }}</v-btn
                              >
                            </v-card-text>
                          </v-card>
                        </v-col>
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
                      <v-btn
                        v-if="contactReason == 'Get Approval'"
                        :disabled="!chosenRepair.order"
                        text
                        @click="postTransaction()"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        v-if="contactReason == 'Gather more information'"
                        text
                        :disabled="contactText.length < 2"
                        @click="addNote(contactText)"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        v-if="contactReason == 'Ready for pickup'"
                        text
                        @click="addNote('called for pickup')"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-col v-for="contact in order.contacts" :key="contact.id">
                  <ContactObj :contact="contact"></ContactObj>
                </v-col>
              </v-row> </v-card-text
            ><v-card-actions> </v-card-actions
          ></v-card> </v-col
        ><v-col v-if="order.transaction"
          ><CartBalance
            :products="order.transaction.products"
            :customer="order.customer"
            :services="order.transaction.services"
            :loadtransaction="order.transaction"
            :order="order"
          >
            <v-card v-if="!finalNoteDialog" slot="repairSummary" class="mb-5">
              <v-card-text @click="editFinalNote"
                ><b>{{
                  order.finalNote ? order.finalNote : 'click to add final note'
                }}</b></v-card-text
              >
            </v-card>
            <v-textarea
              v-if="finalNoteDialog"
              ref="finalNOTE"
              slot="repairSummary"
              v-model="repairSummary"
              outlined
              label="Summary"
              :append-icon="repairSummary.length > 3 ? 'mdi-content-save' : ''"
              @click:append="postFinalNote"
            ></v-textarea></CartBalance></v-col></v-row
    ></v-container>
  </div>
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
      editSymptom: false,
      newSymptom: '',
      finalNoteDialog: false,
      repairSummary: '',
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
      printMode: false,
    }
  },
  computed: {
    orderStatusPhrase() {
      if (this.order.completed) return 'Order complete. No changes can be made.'
      const completedText = 'Order in Progress'
      let detailText = ''
      if (this.order.status === 'needs-approval') {
        detailText = 'Needs Approval.'
      }
      if (this.order.status === 'work-approved') {
        detailText = 'Repair Approved Call When Finished'
      }
      if (this.order.status === 'order-paid-for') {
        detailText = 'Paid, Waiting for Pickup'
      }
      return completedText + ' - ' + detailText
    },
    readyForPickup() {
      if (this.order.notes) {
        const noteTexts = this.order.notes.map((n) => n.text)
        if (noteTexts.includes('called for pickup')) return true
      } else return false
      return false
    },
    orderCompleted() {
      return this.order.completed
    },
    fullView() {
      if (this.$route.params.id === this.order._id) return true
      return false
    },
    ...mapState(['taxrate', 'order', 'chosenProducts', 'chosenServices']),
  },
  mounted() {
    this.fetchOrder(this.$route.params.id)
  },
  methods: {
    changeSymptom() {
      this.newSymptom = this.order.symptoms
      this.editSymptom = true
      setTimeout(() => {
        this.$refs.symptom.focus()
      }, 500)
    },
    updateSymptom() {
      const symptoms = {
        order: this.$route.params.id,
        text: this.newSymptom,
      }
      console.log(symptoms.text)
      this.updateOrderSymptoms(symptoms)
      this.editSymptom = false
    },
    postFinalNote() {
      const note = {
        text: this.repairSummary,
        order: this.$route.params.id,
      }
      if (this.repairSummary !== this.order.finalNote) {
        this.setFinalNote(note)
      }
      this.finalNoteDialog = false
    },
    editFinalNote() {
      if (this.order.finalNote) this.repairSummary = this.order.finalNote
      this.finalNoteDialog = true
      setTimeout(() => {
        this.$refs.finalNOTE.focus()
      }, 100)
    },
    print() {
      this.printMode = true
      setTimeout(() => {
        this.$htmlToPaper('printMe')
        this.printMode = false
      }, 1000)
    },
    postTransaction() {
      const transaction = {
        order: this.$route.params.id,
        products: this.chosenRepair.products,
        services: this.chosenRepair.services,
        context: 'work-order',
        customer: this.order.customer,
      }
      this.createOrderTransaction(transaction)
      this.contactDialog = false
      this.contactReason = ''
      this.contactText = ''
      this.chosenRepair = {}
      setTimeout(() => {
        this.$forceUpdate()
      }, 100)
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
    addNote(customnote) {
      const note = {
        text: this.noteText || customnote,
        order: this.order._id,
      }
      this.createNote(note)
      this.noteText = ''
      this.noteDialog = false
      if (customnote) this.contactDialog = false
    },
    getBalance(repair) {
      const productServices = repair.products.concat(repair.services)
      const subtotal = productServices.map((i) => {
        const multiplied = i.price * i.incart
        const format = multiplied.toFixed(2)
        if (i.incart > 0) return (format * 100) / 100
        else {
          const format = parseFloat(i.price).toFixed(2) * 1
          return format
        }
      })
      if (subtotal.length) {
        const subtotalsum = subtotal.reduce((a, b) => a + b)
        const taxes = productServices.map((ps) => {
          if (ps.taxable) {
            const subtotal = ps.price * ps.incart
            const calculateTax = subtotal * (this.taxrate - 1)
            const format = parseFloat(calculateTax).toFixed(2) * 1
            return format
          } else {
            return 0
          }
        })
        const taxessum = taxes.reduce((a, b) => a + b)
        const subtotalTaxes = subtotalsum + taxessum
        return parseFloat(subtotalTaxes).toFixed(2) * 1
      } else return 0
    },
    chooseRepair(repair) {
      this.chosenRepair = repair
    },
    compareRepairOptionToTransaction(repair) {
      if (repair && this.order.transaction) {
        const matchNumOfProducts =
          repair.products.length === this.order.transaction.products.length
        const matchNumOfServices =
          repair.services.length === this.order.transaction.services.length
        if (!matchNumOfProducts || !matchNumOfServices) return false
        else if (this.order.transaction.products.length) {
          const firstProductsMatch =
            repair.products[0]._id === this.order.transaction.products[0]._id
          return firstProductsMatch
        } else {
          const firstServicesMatch =
            repair.services[0]._id === this.order.transaction.services[0]._id
          return firstServicesMatch
        }
      } else return false
    },
    ...mapActions([
      'fetchOrder',
      'createNote',
      'createRepairOption',
      'clearChosenProducts',
      'clearChosenServices',
      'createOrderTransaction',
      'setFinalNote',
      'updateOrderSymptoms',
    ]),
  },
}
</script>
