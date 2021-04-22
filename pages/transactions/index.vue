<template>
  <v-container>
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
          <template v-slot:no-data>No Layaways</template></v-data-table
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
          <template v-slot:item._id="{ item }">
            {{ item._id.substr(item._id.length - 7).toUpperCase() }}
          </template>
          <template v-slot:item.products="{ item }">
            <div v-for="(product, index) in item.products" :key="product._id">
              {{ product.name
              }}{{ item.products.length - 1 > index ? ',' : '' }}
            </div>
            <div v-for="(service, index) in item.services" :key="service._id">
              {{ service.name
              }}{{ item.services.length - 1 > index ? ',' : '' }}
            </div>
          </template>
          <template v-slot:item.balanceDue="{ item }">
            <b
              >${{
                item.balanceDue > 0
                  ? `${parseFloat(item.balanceDue).toFixed(2)}`
                  : '0.00'
              }}</b
            >
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
          <template v-slot:no-data>No transactions</template>
        </v-data-table></v-col
      >
    </v-row>
    <v-row> <h2>Reports</h2></v-row>
    <v-card class="my-5">
      <v-card-text>
        <v-col
          ><v-select
            v-model="selectRange"
            :items="dateRange"
            :value="thisMonth"
            label="Date Range"
          ></v-select>
        </v-col>
        <v-col v-if="transactions.length"
          ><b>Net Sales:</b
          >{{ ` $${parseFloat(accumulateSales(selectRange)).toFixed(2)}` }}
        </v-col>
        <v-col v-if="transactions.length"
          ><b>Net Taxable Sales:</b
          >{{ ` $${parseFloat(netTaxable).toFixed(2)}` }}
        </v-col>
        <v-col v-if="transactions.length"
          ><b>Sales Tax Collected:</b
          >{{ ` $${parseFloat(accumulateTaxes(selectRange)).toFixed(2)}` }}
        </v-col>
        <v-col v-if="transactions.length"
          ><b>Gross Sales:</b
          >{{
            ` $${parseFloat(
              accumulateSales(selectRange) + accumulateTaxes(selectRange),
            ).toFixed(2)}`
          }}
        </v-col>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      selectRange: '',
      months: [
        'January',
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
      ],
      search: '',
      filterBy: ['quick-sale', 'work-order'],
      filterSelected: [],
      headers: [
        { text: 'Created', value: 'created' },
        { text: 'ID', value: '_id' },
        { text: 'Customer', value: 'customer.fullName' },
        {
          text: 'Context',
          value: 'context',
          filter: (value) => {
            if (!this.filterSelected.length) return true
            return this.filterSelected.includes(value)
          },
          sortable: false,
        },
        { text: 'Items', value: 'products' },
        { text: 'Balance Due', value: 'balanceDue' },
        {
          text: 'Completed',
          value: 'completed',
        },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      layawayHeaders: [
        { text: 'Started', value: 'created' },
        { text: 'Products', value: 'products' },
        { text: 'Subtotal', value: 'subtotal' },
        { text: 'Tax', value: 'taxes' },
        { text: 'Paid', value: 'paid' },
        { text: 'Balance Due', value: 'balanceDue' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    dateRange() {
      return this.months.concat('2021')
    },
    netTaxable() {
      const calculateUntaxed = this.salesTaxesNotCollected / 0.0725
      return this.accumulateSales(this.selectRange) - calculateUntaxed
    },
    salesTaxesNotCollected() {
      const everySaleTaxed = this.accumulateSales(this.selectRange) * 0.0725
      return everySaleTaxed - this.accumulateTaxes(this.selectRange)
    },
    thisMonth() {
      const d = new Date()
      return this.dateRange[d.getMonth()]
    },
    thisYear() {
      const d = new Date()
      return this.dateRange[d.getYear()]
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
      if (this.months.includes(range)) {
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
      } else {
        const rangeOfTaxes = completed.filter((c) => {
          return new Date(c.completed).getYear() === 121
        })
        const justTaxes = rangeOfTaxes.map((rot) => rot.taxes)
        if (justTaxes.length) {
          const accumulated = justTaxes.reduce((a, b) => {
            return a + b
          })
          return accumulated
        } else return 0
      }
    },
    accumulateSales(range) {
      const completed = this.transactions.filter((t) => t.completed)
      if (this.months.includes(range)) {
        const rangeOfSubtotals = completed.filter(
          (c) => this.dateRange[new Date(c.completed).getMonth()] === range,
        )
        const justSubtotal = rangeOfSubtotals.map((rot) => rot.subtotal)
        if (justSubtotal.length) {
          const accumulated = justSubtotal.reduce((a, b) => {
            return a + b
          })
          return accumulated
        } else return 0
      } else {
        const rangeOfSubtotals = completed.filter((c) => {
          return new Date(c.completed).getYear() === 121
        })
        const justSubtotal = rangeOfSubtotals.map((rot) => rot.subtotal)
        if (justSubtotal.length) {
          const accumulated = justSubtotal.reduce((a, b) => {
            return a + b
          })
          return accumulated
        } else return 0
      }
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
