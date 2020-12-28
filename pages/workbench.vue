<template>
  <v-container>
    <h2>Workbench</h2>
    <v-row>
      <v-col v-for="order in orders" :key="order.id">
        <OrderObj :order="order"></OrderObj>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'auth',
  components: {},
  async fetch({ store }) {
    return await store.dispatch('fetchWorkbench')
  },
  computed: {
    ...mapState(['orders']),
  },
}
</script>
