<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- {{ order }} -->
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
  async fetch({ store, params }) {
    return await store.dispatch('fetchOrder', params.id)
  },
  computed: {
    ...mapState(['order']),
  },
}
</script>
