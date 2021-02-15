<template>
  <v-container>
    <h2>Services</h2>
    <v-row>
      <v-col><ServiceSelect></ServiceSelect></v-col>
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
    addToFilter(k) {
      if (this.filterCategories.includes(k)) {
        const index = this.filterCategories.indexOf(k)
        return this.filterCategories.splice(index, 1)
      }
      this.filterCategories.push(k)
    },
    ...mapActions(['fetchServices', 'fetchCategories']),
  },
}
</script>

<style lang="scss" scoped></style>
