<template>
  <div>
    <v-card>
      <v-card-title class="headline grey lighten-2"> New Service </v-card-title>
      <v-card-text class="py-2">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="service.name"
                :value="servicename"
                outlined
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <!-- <CategorySelector
                @updatecategories="updateCategories"
              ></CategorySelector> -->
              <v-select
                v-model="service.categories"
                :items="categories"
                multiple
                outlined
                label="Category"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="service.cost"
                type="number"
                outlined
                label="cost"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="3">
              <v-text-field
                v-model="service.price"
                type="number"
                outlined
                label="price"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="createService"> Save </v-btn>
        <v-btn text @click="$emit('cancelAdd')"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    servicename: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      service: {
        name: '',
        cost: null,
        price: null,
        category: [],
      },
    }
  },
  computed: {
    ...mapState(['categories']),
  },
  mounted() {
    this.service.name = this.servicename
    return this.fetchCategories()
  },
  methods: {
    updateCategories(selected) {
      this.service.categories = selected
    },
    createService() {
      this.$emit('postService', this.service)
    },
    ...mapActions(['fetchCategories']),
  },
}
</script>

<style lang="scss" scoped></style>
