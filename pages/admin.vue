<template>
  <v-container>
    <v-row>
      <v-chip v-for="keyword in keywords" :key="keyword._id">
        {{ keyword.name }}
      </v-chip>
    </v-row>
    <v-row
      ><v-col
        ><v-text-field
          v-model="newKeyword"
          label="New Keyword"
          :append-icon="newKeyword.length > 3 ? 'mdi-content-save' : ''"
          @click:append="postKeyword"
        >
        </v-text-field></v-col
    ></v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      newKeyword: '',
    }
  },
  computed: {
    ...mapState(['keywords']),
  },
  mounted() {
    return this.fetchKeywords
  },
  methods: {
    postKeyword() {
      const keyword = {
        name: this.newKeyword,
      }
      this.addKeyword(keyword)
      this.newKeyword = ''
    },
    ...mapActions(['fetchKeywords', 'addKeyword']),
  },
}
</script>

<style lang="scss" scoped></style>
