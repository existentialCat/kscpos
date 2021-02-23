<template>
  <v-container>
    <v-row>
      <v-col v-if="ordersStage" cols="12"
        ><v-card
          :color="
            ordersStage == 'completed' || ordersStage == 'order-paid-for'
              ? 'primary'
              : ''
          "
          dark
          ><v-card-title
            >{{
              ordersStage == 'completed'
                ? 'Order complete. No changes can be made.'
                : 'Order in Progress'
            }}{{ ordersStage == 'needs-approval' ? ' - Needs Approval' : ''
            }}{{
              ordersStage == 'work-approved' && readyForPickup
                ? ' - Ready for pickup'
                : ordersStage == 'work-approved'
                ? ' - Repair Approved Call When Finished'
                : ''
            }}{{
              ordersStage == 'order-paid-for'
                ? ' - Paid, Waiting for Pickup'
                : ''
            }}</v-card-title
          ></v-card
        ></v-col
      >
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
                <RepairOption
                  :repairoption="repairoption"
                  :chosen="compareRepairOptionToTransaction(repairoption)"
                ></RepairOption>
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
                      <v-col
                        v-for="(repairOption, indexA) in order.repairOptions"
                        :key="indexA"
                      >
                        <v-card>
                          <v-card-text
                            v-for="(repair,
                            indexB) in repairOption.services.concat(
                              repairOption.products,
                            )"
                            :key="indexB"
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
          :stage="ordersStage"
          :loadtransaction="order.transaction"
          :order="order"
        ></CartBalance></v-col></v-row
    >{{ ordersStage }}{{ order.transaction }}</v-container
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
    ordersStage() {
      if (this.order.completed) return 'completed'
      if (this.order.transaction && this.order.transaction.balanceDue < 0)
        return 'order-paid-for'
      if (this.order.transaction) return 'work-approved'
      if (this.order.repairOptions.length) return 'needs-approval'
      else return 'pending'
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
    this.fetchOrder(this.$route.params.id).then(() => {
      console.log(this.order._id)
    })
  },
  methods: {
    postTransaction() {
      const transaction = {
        order: this.$route.params.id,
        products: this.chosenRepair.products,
        services: this.chosenRepair.services,
        context: 'work-order',
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
          const format = i.price.toFixed(2)
          return (format * 100) / 100
        }
      })
      if (subtotal.length > 0) {
        const subtotalsum = subtotal.reduce((a, b) => a + b)
        const taxes = productServices.map((ps) => {
          if (ps.taxable) {
            const subtotal = ps.price * ps.incart
            const calculateTax = subtotal * (this.taxrate - 1)
            const format = calculateTax.toFixed(2)
            return (format * 100) / 100
          } else return ps.price * ps.incart
        })
        const taxessum = taxes.reduce((a, b) => a + b)
        return subtotalsum + taxessum
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
    ]),
  },
}
</script>
