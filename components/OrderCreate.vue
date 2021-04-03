<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on" @click="dialog = true"
          >Create New Order</v-btn
        >
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2"> Check in </v-card-title>
        <v-card-text class="py-2">
          <v-container>
            <v-row>
              <v-col>
                <v-stepper v-model="step">
                  <v-col>
                    <v-stepper-step
                      :complete="step > 1"
                      step="1"
                      @click="step = 1"
                    >
                      <h4>
                        <span class="grey--text">Select Customer:</span>
                        <b>{{
                          chosenCustomer.fullName
                            ? `${chosenCustomer.fullName} - ${chosenCustomer.phone}`
                            : ''
                        }}</b>
                      </h4>
                    </v-stepper-step>
                    <v-stepper-items>
                      <v-stepper-content step="1">
                        <v-data-table
                          :items="customers"
                          :search="customerSearch"
                          :headers="customerheaders"
                          :items-per-page="5"
                        >
                          <template v-slot:top>
                            <v-text-field
                              v-model="customerSearch"
                              append-icon="mdi-magnify"
                              label="Search"
                              single-line
                              hide-details
                              autocomplete="new-password"
                            ></v-text-field
                          ></template>
                          <template v-slot:item.actions="{ item }">
                            <v-btn
                              text
                              small
                              @click=";(chosenCustomer = item), step++"
                            >
                              Choose
                            </v-btn>
                          </template>
                          <template v-slot:no-results
                            >Customer not found.
                            <v-dialog
                              v-model="addCustomer"
                              persistent
                              max-width="1000px"
                            >
                              <template v-slot:activator="{ on, attrs }"
                                ><v-btn
                                  small
                                  outlined
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="custName = customerSearch"
                                  >Add as New</v-btn
                                ></template
                              >
                              <CustomerCreate
                                :customername="customerSearch"
                                @postCustomer="postCustomer"
                                @cancelAdd="addCustomer = false"
                              ></CustomerCreate> </v-dialog
                          ></template>
                          <template v-slot:no-data
                            >No Customers yet.
                            <v-dialog
                              v-model="addCustomer"
                              persistent
                              max-width="1000px"
                            >
                              <template v-slot:activator="{ on, attrs }"
                                ><v-btn
                                  small
                                  outlined
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="custName = customerSearch"
                                  >Add as New</v-btn
                                ></template
                              >
                              <CustomerCreate
                                :customername="customerSearch"
                                @postCustomer="postCustomer"
                                @cancelAdd="addCustomer = false"
                              ></CustomerCreate> </v-dialog
                          ></template> </v-data-table
                      ></v-stepper-content>
                    </v-stepper-items>
                    <v-stepper-step :complete="step > 2" step="2">
                      <h4>System Details</h4>
                    </v-stepper-step>
                    <v-stepper-items>
                      <v-stepper-content step="2">
                        <v-row>
                          <v-col>
                            <v-card
                              v-for="(system, index) in systems"
                              :key="index"
                            >
                              <v-card-text
                                ><v-row
                                  ><v-col>{{ system.sysType }}</v-col
                                  ><v-col>{{ system.brand }}</v-col
                                  ><v-col>{{ system.model }}</v-col
                                  ><v-col></v-col></v-row
                              ></v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            ><v-select
                              v-model="sysType"
                              label="Device Type"
                              :items="[
                                'Laptop',
                                'Desktop',
                                'Game Console',
                                'Phone',
                                'Tablet',
                                'Other',
                              ]"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="brand"
                              label="Brand"
                              autocomplete="new-password"
                            ></v-text-field
                          ></v-col>
                          <v-col>
                            <v-text-field
                              v-model="model"
                              label="Model"
                              autocomplete="new-password"
                            ></v-text-field
                          ></v-col>
                          <v-col>
                            <v-text-field
                              v-model="sn"
                              label="SN"
                              autocomplete="new-password"
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="symptoms"
                              outlined
                              label="Symptoms"
                              autocomplete="new-password"
                            ></v-textarea></v-col
                          ><v-btn v-if="systemLoaded" @click="addSystem"
                            >Add Another System</v-btn
                          >
                          <v-col cols="12"> <v-divider></v-divider> </v-col
                          ><v-col cols="6">
                            <v-combobox
                              v-model="accessory"
                              label="Items Left with us"
                              :items="['A/C Adapter', 'Bag']"
                              @keyup.enter="
                                itemsLeft.push(accessory), (accessory = '')
                              "
                            ></v-combobox
                          ></v-col>
                          <v-col v-for="(item, index) in itemsLeft" :key="index"
                            >{{ item
                            }}<v-btn
                              icon
                              x-small
                              @click="itemsLeft.splice(index, 1)"
                              ><v-icon>mdi-close</v-icon></v-btn
                            ></v-col
                          >
                        </v-row></v-stepper-content
                      ></v-stepper-items
                    ></v-col
                  >
                </v-stepper>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!infoCollected"
            @click="processCheckin"
          >
            Save Check in
          </v-btn>
          <v-btn text @click="dialog = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      brand: '',
      model: '',
      sysType: '',
      sn: '',
      symptoms: '',
      symptomArr: [],
      dialog: false,
      step: 1,
      chosenCustomer: {},
      customerSearch: '',
      addCustomer: false,
      customerheaders: [
        { text: 'Customer', value: 'fullName' },
        { text: 'Phone', value: 'phone' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      systems: [],
      accessory: '',
      itemsLeft: [],
    }
  },
  computed: {
    systemLoaded() {
      const hasSymptoms = this.symptoms.length > 0
      const hasSysType = this.sysType.length > 0
      if (this.systems.length) return true
      return hasSymptoms && hasSysType
    },
    infoCollected() {
      const customerSelected = this.chosenCustomer.phone
      return customerSelected && this.systemLoaded
    },
    ...mapState(['customers', 'taxrate']),
  },
  mounted() {
    return this.fetchAllCustomers()
  },
  methods: {
    addSystem() {
      const system = {
        brand: this.brand,
        model: this.model,
        sysType: this.sysType,
        sn: this.sn,
        symptom: this.symptoms,
      }
      const systemSymptoms =
        '|' +
        system.brand +
        ' ' +
        system.model +
        `|: ` +
        this.symptoms +
        '          '
      console.log(systemSymptoms)
      this.symptomArr.push(systemSymptoms)
      this.symptoms = ''
      this.brand = ''
      this.model = ''
      this.sysType = ''
      this.sn = ''
      this.sysType = ''
      this.brand = ''
      this.symptoms = ''
      this.model = ''
      this.sn = ''
      this.systems.push(system)
    },
    postCustomer(cust) {
      const customer = {
        fullName: cust.fullName,
        phone: cust.phone,
      }
      this.addCustomer = false
      this.createCustomer(customer)
    },
    processCheckin() {
      console.log('processing checkin...')
      if (this.accessory && this.accessory.length >= 1) {
        this.itemsLeft.push(this.accessory)
      }
      const loadedFields = this.sysType.length && this.symptoms.length
      if (loadedFields) {
        const system = {
          sysType: this.sysType,
          brand: this.brand,
          model: this.model,
          sn: this.sn,
        }
        if (this.systems.length > 0) {
          const systemSymptoms =
            '|' +
            system.brand +
            ' ' +
            system.model +
            `|: ` +
            this.symptoms +
            '          '
          this.symptomArr.push(systemSymptoms)
        } else this.symptomArr.push(this.symptoms)
        this.systems.push(system)
        this.sysType = ''
        this.brand = ''
        this.symptoms = ''
        this.model = ''
        this.sn = ''
      }
      console.log(this.symptomArr)
      const symptomString = this.symptomArr.join(' ')
      const order = {
        customerId: this.chosenCustomer._id,
        context: 'work-order',
        agreeToTerms: true,
        itemsLeft: this.itemsLeft,
        systems: this.systems,
        symptoms: symptomString,
      }
      console.log(order)
      this.createOrder(order).then((res) => {
        this.$router.push(`/orders/${res._id}`)
      })
    },
    ...mapActions(['fetchAllCustomers', 'createCustomer', 'createOrder']),
  },
}
</script>

<style lang="scss" scoped></style>
