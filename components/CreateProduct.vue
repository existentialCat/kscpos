<template>
  <div>
    <v-card>
      <v-card-title class="headline grey lighten-2"> New Product </v-card-title>
      <v-card-text class="py-2">
        <v-text-field
          v-model="prod.name"
          :value="productname"
          outlined
          label="Name"
        ></v-text-field>
        <v-text-field
          v-model="prod.vendor"
          outlined
          label="Vendor"
        ></v-text-field>
        <!-- change to custom v-combobox for on the go keyword creation -->
        <v-select
          v-model="prod.keywords"
          :items="keywords"
          outlined
          multiple
          item-text="name"
          item-value="_id"
          label="Keywords"
        ></v-select>
        <v-combobox
          v-model="prod.keywords"
          :filter="filter"
          :hide-no-data="!search"
          :items="keywords"
          item-text="text"
          item-value="_id"
          :search-input.sync="search"
          hide-selected
          label="Keywords"
          multiple
          small-chips
          solo
          @keydown.enter="addNewKeyword"
        >
          <template v-slot:no-data>
            <v-list-item>
              <span class="subheading">Create Keyword</span>
              <v-chip label small>
                {{ search }}
              </v-chip>
            </v-list-item>
          </template>
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              v-bind="attrs"
              :input-value="selected"
              label
              small
            >
              <span class="pr-2">
                {{ item.name }}
              </span>
              <v-icon small @click="parent.selectItem(item)"> close </v-icon>
            </v-chip>
          </template>
          <template v-slot:item="{ index, item }">
            <v-text-field
              v-if="editing === item"
              v-model="editing.name"
              autofocus
              flat
              background-color="transparent"
              hide-details
              solo
              @keyup.enter="edit(index, item)"
            ></v-text-field>
            <v-chip v-else lighten-3 dark label small>
              {{ item.name }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="edit(index, item)">
                <v-icon>{{
                  editing !== item ? 'mdi-pencil' : 'mdi-check'
                }}</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>

        <v-text-field
          v-model="prod.brand"
          outlined
          label="Brand"
        ></v-text-field>
        <v-text-field
          v-model="prod.model"
          outlined
          label="Model"
        ></v-text-field>
        <v-text-field v-model="prod.sn" outlined label="SN"></v-text-field>
        <v-text-field v-model="prod.cost" outlined label="cost"></v-text-field>
        <v-text-field
          v-model="prod.price"
          outlined
          label="price"
        ></v-text-field>
        <v-text-field v-model="prod.qty" outlined label="qty"></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="createProduct"> Save </v-btn>
        <v-btn text @click="$emit('cancelAdd')"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    productname: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activator: null,
      editing: null,
      editingIndex: -1,
      search: '',
      prod: {
        name: '',
        vendor: '',
        keywords: [],
        brand: '',
        model: '',
        sn: '',
        cost: null,
        price: null,
        qty: null,
      },
    }
  },
  computed: {
    ...mapState(['keywords']),
  },
  mounted() {
    this.prod.name = this.productname
    return this.fetchKeywords()
  },
  methods: {
    addNewKeyword() {
      const keywordNames = this.keywords.map((k) => k.name)
      if (!keywordNames.includes(this.search)) {
        const keyword = {
          name: this.search,
        }
        this.addKeyword(keyword)
      }
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.editingIndex = index
      } else {
        this.editing = null
        this.editingIndex = -1
      }
    },
    filter(item, queryText, itemText) {
      const hasValue = (val) => (val != null ? val : '')
      const text = hasValue(item.name)
      const query = hasValue(queryText)
      return text
        .toString()
        .toLowerCase()
        .includes(query.toString().toLowerCase())
    },
    createProduct() {
      this.$emit('postProd', this.prod)
    },
    ...mapActions(['fetchKeywords', 'addKeyword']),
  },
}
</script>

<style lang="scss" scoped></style>
