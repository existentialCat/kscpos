<template>
  <v-container>
    <h2>Services</h2>
    <v-row>
      <v-col
        ><v-data-table
          ref="servtable"
          :items="services"
          :search="search"
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
                :color="!filterCategories.length ? 'primary' : ''"
                @click="filterCategories = []"
                >All</v-chip
              ><v-chip
                v-for="category in categories"
                :key="category._id"
                class="ma-1"
                :color="filterCategories.includes(category) ? 'primary' : ''"
                @click="addToFilter(category)"
                >{{ category.name }}</v-chip
              ></v-row
            ></template
          >
          <template v-slot:item.categories="{ item }">
            <v-chip
              v-for="category in item.categories"
              :key="category._id"
              small
            >
              {{ category.name }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn text small @click="$router.push(`/services/${item._id}`)">
              Open
            </v-btn>
          </template>
          <template v-slot:no-results
            >Service not found.
            <v-dialog v-model="addService" persistent max-width="1000px">
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="servName = search"
                  >Add as New</v-btn
                ></template
              >
              <CreateService
                :servicename="search"
                @postProd="postService"
                @cancelAdd="addService = false"
              ></CreateService> </v-dialog
          ></template>
          <template v-slot:no-data
            >No Services yet.
            <v-dialog v-model="addService" persistent max-width="1000px">
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="servName = search"
                  >Add as New</v-btn
                ></template
              >
              <CreateService
                :servicename="search"
                @postProd="postService"
                @cancelAdd="addService = false"
              ></CreateService> </v-dialog
          ></template> </v-data-table
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      search: '',
      addService: false,
      filterCategories: [],
      headers: [
        { text: 'Service', value: 'name' },
        {
          text: 'Categories',
          value: 'categories',
          filter: (value) => {
            if (!this.filterCategories.length) return true
            if (!value.length) return false
            const valCategories = value.map((vk) => vk.name)
            const categories = this.filterCategories.map((k) => k.name)
            for (const i in valCategories) {
              if (categories.includes(valCategories[i])) return true
            }
          },
          sortable: false,
        },
        { text: 'Cost', value: 'cost' },
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapState(['services', 'categories']),
  },
  mounted() {
    this.fetchCategories()
    return this.fetchServices()
  },
  methods: {
    postService(serv) {
      const service = {
        name: serv.name,
        vendor: serv.vendor,
        categories: serv.categories,
        brand: serv.brand,
        model: serv.model,
        sn: serv.sn,
        cost: serv.cost,
        price: serv.price,
        qty: serv.qty,
      }
      this.addService = false
      this.createService(service)
    },
    addToFilter(k) {
      if (this.filterCategories.includes(k)) {
        const index = this.filterCategories.indexOf(k)
        return this.filterCategories.splice(index, 1)
      }
      this.filterCategories.push(k)
    },
    ...mapActions(['fetchServices', 'fetchCategories', 'createService']),
  },
}
</script>

<style lang="scss" scoped></style>
