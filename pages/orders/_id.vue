<template>
  <div>
    <v-card v-if="printMode" id="printMe" outlined>
      <v-card-text style="color: black; font-family: 'Roboto'">
        <v-container>
          <v-row align="center">
            <v-col>
              <v-row><h2>Check in Sheet</h2></v-row>
              <v-row
                >Date: {{ new Date(order.created).toLocaleString() }}</v-row
              >
              <v-row
                >ORDER ID:
                {{
                  order._id.substr(order._id.length - 7).toUpperCase()
                }}</v-row
              ></v-col
            ><v-col
              ><v-img contain max-width="200px" src="/logo.png"></v-img></v-col
            ><v-col>
              <v-row><h2>Keith Stone Computers</h2></v-row>
              <v-row>5220 Lewis Ave. Toledo, OH 43612</v-row>
              <v-row>419-214-0222</v-row>
              <v-row>KeithStoneComputers.com</v-row>
            </v-col></v-row
          >
          <v-row><h3>Customer</h3></v-row>
          <v-row>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text style="color: black"
                  ><v-row
                    ><v-col
                      >Checkin Date:
                      <b>{{
                        new Date(order.created).toLocaleString()
                      }}</b></v-col
                    ><v-col
                      >Client: <b>{{ order.customer.fullName }}</b></v-col
                    ><v-col
                      >Main Phone: <b>{{ order.customer.phone }}</b></v-col
                    ></v-row
                  ></v-card-text
                >
              </v-card></v-col
            ></v-row
          >
          <v-row style=""><h3>System</h3></v-row>
          <v-row>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text style="color: black"
                  ><v-row
                    ><v-col
                      >System Type: <b>{{ order.systems[0].sysType }}</b></v-col
                    ><v-col
                      >Brand: <b>{{ order.systems[0].brand }}</b></v-col
                    ><v-col
                      >Model: <b>{{ order.systems[0].model }}</b></v-col
                    ></v-row
                  ></v-card-text
                >
              </v-card></v-col
            ></v-row
          >
          <v-row><h3>Problem</h3></v-row>
          <v-row>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text style="color: black"
                  ><v-row
                    ><v-col>
                      <b>{{ order.symptoms }}</b>
                    </v-col></v-row
                  ></v-card-text
                >
              </v-card></v-col
            ></v-row
          >
          <v-row><h3>Additional Information</h3></v-row>
          <v-row>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text style="color: black"
                  ><v-row align="center"
                    ><v-col>Items Left: {{ order.itemsLeft[0] }}</v-col
                    ><v-col
                      >Data Important?
                      <v-icon>mdi-checkbox-blank-outline</v-icon></v-col
                    ><v-col
                      >Requires Password to Login?
                      <v-icon>mdi-checkbox-blank-outline</v-icon>
                    </v-col></v-row
                  ></v-card-text
                >
              </v-card></v-col
            ></v-row
          >
          <v-row align="center"
            ><v-col
              >I have read, undersatnd, and accept the terms and conditions
              stated on this receipt</v-col
            ><v-col>
              <v-text-field
                persistent-hint
                hint="Customer's Signature"
              ></v-text-field> </v-col
            ><v-col>
              <v-text-field persistent-hint hint="Date"></v-text-field> </v-col
          ></v-row>
          <v-row style=""><h3>Terms and Conditions</h3></v-row>
          <v-row
            ><v-col
              ><p style="font-size: x-small !important">
                No refunds, exchanges only. *FREE DIAGNOSTICS require a repair
                for it to be free. DIAGNOSTICS WILL BE $20 EACH FOR ALL
                DIAGNOSTICS WHEN NO REPAIR OF CURRENT CHECKED IN SYSTEM OR A
                SALE OF A SYSTEM. While every effort will be made to ensure data
                handling, Keith Stone Computers will not accept responsibility
                for the loss of data or programs. Customers are advised to
                backup any important data or retain their original setup disks
                for programs on their PC. Only after a complete diagnostic of
                the PC can the full extent of any problems be identified. The
                Diagnostics can take 1 to 3 days and we will call the customer
                when the complete diagnostic has been performed. The customer
                can call after 3 business days to get the results of the
                diagnostic results. All repairs carry a 60 day parts and labor
                warranty. Damage or defects, which are in our opinion, directly
                caused by incorrect or improper use, neglect or by mishandling
                by the user is specifically excluded from any warranty given or
                implied. Keith Stone Computers is not liable for any loss/damage
                of any items left here after 45 days. Any items left after 45
                days will be disposed of, without any further notice (layaways
                are lost after 60 days). Keith Stone Computers, 5220 Lewis Ave,
                Toledo, Ohio 43612, Phone: 419-214-0222
              </p></v-col
            ></v-row
          >
        </v-container>
      </v-card-text>
    </v-card>
    <v-container v-if="order.customer.fullName">
      <v-btn @click="print()">Print</v-btn>
      <v-row>
        <v-col v-if="order.status" cols="12"
          ><v-card
            :color="
              order.status == 'completed' || order.status == 'order-paid-for'
                ? 'primary'
                : ''
            "
            dark
            ><v-card-title
              >{{
                order.completed
                  ? 'Order complete. No changes can be made.'
                  : 'Order in Progress'
              }}{{ order.status == 'needs-approval' ? ' - Needs Approval' : ''
              }}{{
                order.status == 'work-approved' && readyForPickup
                  ? ' - Ready for pickup'
                  : order.status == 'work-approved'
                  ? ' - Repair Approved Call When Finished'
                  : ''
              }}{{
                order.status == 'order-paid-for' && !order.completed
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
          ></CartBalance></v-col></v-row
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
    ]),
  },
}
</script>
