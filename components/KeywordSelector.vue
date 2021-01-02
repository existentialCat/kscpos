<template>
  <div>
    <v-combobox
      v-model="selectedKeywords"
      :filter="filter"
      :hide-no-data="!search"
      :items="keywords"
      item-text="text"
      item-value="_id"
      :search-input.sync="search"
      hide-selected
      outlined
      label="Keywords"
      multiple
      small-chips
      @keydown.enter.prevent="addNewKeyword"
      @change="$emit('updatekeywords', selectedKeywords)"
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
          <v-icon small @click="parent.selectItem(item)"> mdi-close </v-icon>
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
        <!-- <v-list-item-action @click.stop>
          <v-btn icon @click.stop.prevent="edit(index, item)">
            <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
          </v-btn>
        </v-list-item-action> -->
      </template>
    </v-combobox>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      selectedKeywords: [],
      activator: null,
      editing: null,
      editingIndex: -1,
      search: '',
    }
  },
  computed: {
    ...mapState(['keywords']),
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
    ...mapActions(['fetchKeywords', 'addKeyword']),
  },
}
</script>

<style lang="scss" scoped></style>
