<template>
  <v-container>
    <v-row>
      <v-col v-if="transactions.length"
        ><b>Sales Tax Collected:</b
        >{{ ` $${parseFloat(accumulateTaxes(selectRange)).toFixed(2)}` }}
        <v-select
          v-model="selectRange"
          :items="dateRange"
          :value="thisMonth"
        ></v-select>
      </v-col>
      <v-col v-if="transactions.length"
        ><b>Number of completed quick-sale:</b> calculate</v-col
      >
      <v-col v-if="transactions.length"
        ><b>Number of completed work orders:</b> calculate</v-col
      >
    </v-row>
    <v-row> <h2>Layaways</h2></v-row>
    <v-card color="yellow" class="my-5">
      <v-card-text
        ><v-data-table
          :items="layaways"
          :headers="layawayHeaders"
          hide-default-footer
          class="pa-1"
        >
          <template v-slot:item.created="{ item }">
            <div style="">
              {{ new Date(item.created).toLocaleString() }}
            </div>
          </template>
          <template v-slot:item.completed="{ item }">
            <div style="">
              {{
                item.completed
                  ? new Date(item.completed).toLocaleString()
                  : 'False'
              }}
            </div>
          </template>
          <template v-slot:item.products="{ item }">
            <div v-for="(product, index) in item.products" :key="product._id">
              {{ product.name
              }}{{ item.products.length - 1 > index ? ',' : '' }}
            </div>
          </template>
          <template v-slot:item.services="{ item }">
            <div v-for="(service, index) in item.services" :key="service._id">
              {{ service.name
              }}{{ item.services.length - 1 > index ? ',' : '' }}
            </div>
          </template>
          <template v-slot:item.subtotal="{ item }">
            <b>${{ `${((item.subtotal * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.taxes="{ item }">
            <b>${{ `${((item.taxes * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.paid="{ item }">
            <b>${{ `${((item.paid * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.balanceDue="{ item }">
            <b>${{ `${((item.balanceDue * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              text
              small
              @click="$router.push(`/transactions/${item._id}`)"
            >
              Open
            </v-btn>
          </template>
          <template v-slot:no-results
            >Transaction not found under that search.</template
          >
          <template v-slot:no-data>No transactions></template></v-data-table
        ></v-card-text
      ></v-card
    >
    <v-row> <h2>All Transactions</h2></v-row>
    <v-row>
      <v-col
        ><v-data-table
          ref="transtable"
          :items="transactions"
          :search="search"
          dense
          :headers="headers"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field
            ><v-row align="center" class="pa-4"
              >Filter:
              <v-chip
                class="ma-1"
                :color="!filterSelected.length ? 'primary' : ''"
                @click="filterSelected = []"
                >All</v-chip
              ><v-chip
                v-for="(filter, index) in filterBy"
                :key="index"
                class="ma-1"
                :color="filterSelected.includes(filter) ? 'primary' : ''"
                @click="addToFilter(filter)"
                >{{ filter }}</v-chip
              ></v-row
            ></template
          >
          <template v-slot:item.created="{ item }">
            <div style="max-width: 15px !important">
              {{ new Date(item.created).toLocaleString() }}
            </div>
          </template>
          <template v-slot:item.completed="{ item }">
            <div style="max-width: 15px !important">
              {{
                item.completed
                  ? new Date(item.completed).toLocaleString()
                  : 'False'
              }}
            </div>
          </template>
          <template v-slot:item.products="{ item }">
            <div v-for="(product, index) in item.products" :key="product._id">
              {{ product.name
              }}{{ item.products.length - 1 > index ? ',' : '' }}
            </div>
          </template>
          <template v-slot:item.services="{ item }">
            <div v-for="(service, index) in item.services" :key="service._id">
              {{ service.name
              }}{{ item.services.length - 1 > index ? ',' : '' }}
            </div>
          </template>
          <template v-slot:item.subtotal="{ item }">
            <b>${{ `${((item.subtotal * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.taxes="{ item }">
            <b>${{ `${((item.taxes * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.paid="{ item }">
            <b>${{ `${((item.paid * 100) / 100).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.balanceDue="{ item }">
            <b>${{ `${parseFloat(item.balanceDue).toFixed(2)}` }}</b>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              text
              small
              @click="$router.push(`/transactions/${item._id}`)"
            >
              Open
            </v-btn>
          </template>
          <template v-slot:no-results
            >Transaction not found under that search.</template
          >
          <template v-slot:no-data>No transactions></template>
        </v-data-table></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      selectRange: '',
      dateRange: [
        'Janurary',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
        'Year',
      ],
      search: '',
      filterBy: ['quick-sale', 'completed', 'incomplete', 'work-order'],
      filterSelected: [],
      headers: [
        { text: 'Created', value: 'created' },
        { text: 'Completed', value: 'completed' },
        { text: 'Customer', value: 'customer.fullName' },
        {
          text: 'Context',
          value: 'context',
          filter: (value) => {
            if (!this.filterSelected.length) return true
            // if (!value.length) return false
            // const valKeywords = value.map((vk) => vk)
            // const keywords = this.filterSelected.map((k) => k)
            // for (const i in valKeywords) {
            //   if (keywords.includes(valKeywords[i])) return true
            // }
            return this.filterSelected.includes(value)
          },
          sortable: false,
        },
        { text: 'Products', value: 'products' },
        // { text: 'Vendor', value: 'vendor' },
        { text: 'Services', value: 'services' },
        { text: 'Subtotal', value: 'subtotal' },
        { text: 'Tax', value: 'taxes' },
        { text: 'Paid', value: 'paid' },
        { text: 'Balance Due', value: 'balanceDue' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      layawayHeaders: [
        { text: 'Started', value: 'created' },
        { text: 'Products', value: 'products' },
        // { text: 'Vendor', value: 'vendor' },
        { text: 'Subtotal', value: 'subtotal' },
        { text: 'Tax', value: 'taxes' },
        { text: 'Paid', value: 'paid' },
        { text: 'Balance Due', value: 'balanceDue' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    thisMonth() {
      const d = new Date()
      console.log(d.getMonth())
      return this.dateRange[d.getMonth()]
    },
    layaways() {
      return this.transactions.filter((t) => {
        return t.balanceDue > 0 && t.context === 'quick-sale'
      })
    },
    ...mapState(['transactions']),
  },
  mounted() {
    this.selectRange = this.thisMonth
    this.fetchAllTransactions()
  },
  methods: {
    accumulateTaxes(range) {
      const completed = this.transactions.filter((t) => t.completed)
      const rangeOfTaxes = completed.filter(
        (c) => this.dateRange[new Date(c.completed).getMonth()] === range,
      )
      const justTaxes = rangeOfTaxes.map((rot) => rot.taxes)
      if (justTaxes.length) {
        const accumulated = justTaxes.reduce((a, b) => {
          return a + b
        })
        return accumulated
      } else return 0
    },
    addToFilter(k) {
      if (this.filterSelected.includes(k)) {
        const index = this.filterSelected.indexOf(k)
        return this.filterSelected.splice(index, 1)
      }
      this.filterSelected.push(k)
    },
    ...mapActions(['fetchAllTransactions']),
  },
}
</script>

<style lang="scss" scoped></style>
