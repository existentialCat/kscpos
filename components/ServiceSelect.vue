<template>
  <v-data-table
    ref="servtable"
    :items="services"
    :search="serviceSearch"
    :items-per-page="itemsperpage"
    :headers="$route.path == '/services' ? serviceHeaders : serviceHeadersMin"
  >
    <template v-slot:top>
      <v-text-field
        v-model="serviceSearch"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field
    ></template>
    <template v-slot:item.price="{ item }">
      <b>${{ item.price }}</b>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        v-if="$route.path == '/services'"
        text
        small
        @click="$router.push(`/services/${item._id}`)"
        >Open</v-btn
      >
      <v-btn v-else text small @click="addChosenService(item)"> Add </v-btn>
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
            @click="servName = serviceSearch"
            >Add as New</v-btn
          ></template
        >
        <ServiceCreate
          :servicename="serviceSearch"
          @postServ="postService"
          @cancelAdd="addService = false"
        ></ServiceCreate> </v-dialog
    ></template>
    <template v-slot:no-data
      >No inventory.
      <v-dialog v-model="addService" persistent max-width="1000px">
        <template v-slot:activator="{ on, attrs }"
          ><v-btn
            small
            outlined
            v-bind="attrs"
            v-on="on"
            @click="servName = serviceSearch"
            >Add as New</v-btn
          ></template
        >
        <ServiceCreate
          :servicename="serviceSearch"
          @postServ="postService"
          @cancelAdd="addService = false"
        ></ServiceCreate> </v-dialog
    ></template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    itemsperpage: {
      type: [Number, String],
      default: 10,
    },
  },
  data() {
    return {
      serviceSearch: '',
      addService: false,
      serviceHeadersMin: [
        { text: 'Service', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      serviceHeaders: [
        { text: 'Service', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      filterKeywords: [],
    }
  },
  computed: {
    ...mapState(['services', 'keywords', 'chosenServices']),
  },
  created() {
    this.fetchServices()
    this.clearChosenServices()
  },
  methods: {
    postService(serv) {
      const service = {
        name: serv.name,
        cost: serv.cost,
        price: serv.price,
        qty: serv.qty,
      }
      this.addService = false
      this.createService(service)
    },
    addToFilter(k) {
      if (this.filterKeywords.includes(k)) {
        const index = this.filterKeywords.indexOf(k)
        return this.filterKeywords.splice(index, 1)
      }
      this.filterKeywords.push(k)
    },
    ...mapActions([
      'fetchServices',
      'createService',
      'fetchKeywords',
      'addChosenService',
      'removeChosenService',
      'clearChosenServices',
    ]),
  },
}
</script>

<style lang="scss" scoped></style>
