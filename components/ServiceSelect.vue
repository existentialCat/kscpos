<template>
  <v-combobox
    v-model="select"
    label="Service[s]"
    chips
    :items="services"
    hide-selected
    item-text="name"
    multiple
  >
    <template v-slot:selection="service">
      <v-chip
        :key="JSON.stringify(service.item.name)"
        v-bind="service.attrs"
        :input-value="service.selected"
        :disabled="service.disabled"
        @click:close="service.parent.selectItem(data.item)"
        >{{ `${service.item.name} $${service.item.price}`
        }}<v-icon small @click="service.parent.selectItem(service.item)">
          mdi-close
        </v-icon></v-chip
      ></template
    ></v-combobox
  >
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      select: [],
    }
  },
  computed: {
    ...mapState(['services']),
  },
  mounted() {
    this.fetchServices()
  },
  methods: {
    ...mapActions(['fetchServices']),
  },
}
</script>

<style lang="scss" scoped></style>
