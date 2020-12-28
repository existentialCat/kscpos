<template>
  <v-container
    ><v-card :max-width="!fullView ? '400' : ''"
      ><v-card-title
        >{{ order.customer.fullName }} <v-spacer v-if="!fullView" /><v-btn
          v-if="!fullView"
          nuxt
          :to="'/orders/' + order._id"
          >Open</v-btn
        ></v-card-title
      ><v-card-text>
        <v-row>
          <v-col cols="2">
            <h4>Systems</h4>
          </v-col>
          <v-col v-for="system in order.systems" :key="system.id">
            <SystemObj :system="system"></SystemObj>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <h4>Notes</h4>
            <v-btn v-if="fullView" text>Add</v-btn>
          </v-col>
          <v-col v-for="note in order.notes" :key="note.id">
            <NoteObj :note="note"></NoteObj>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="2">
            <h4>Repair Options</h4>
            <v-dialog v-model="dialog" persistent max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-if="fullView" text v-bind="attrs" v-on="on">
                  Add
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Choose products and services needed
                </v-card-title>
                <v-card-text>
                  <ProductSelect></ProductSelect>
                  <ServiceSelect></ServiceSelect>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false"> Cancel </v-btn>
                  <v-btn text @click="dialog = false"> Add </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col v-for="estimate in order.estimations" :key="estimate.id">
            <EstimateObj :estimate="estimate"></EstimateObj>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <h4>Contacts Made</h4>
            <v-btn v-if="fullView" text>Add</v-btn>
          </v-col>
          <v-col v-for="contact in order.contacts" :key="contact.id">
            <ContactObj :contact="contact"></ContactObj>
          </v-col>
        </v-row> </v-card-text
      ><v-card-actions> </v-card-actions></v-card
  ></v-container>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    fullView() {
      if (this.$route.params.id === this.order._id) return true
      return false
    },
  },
}
</script>

<style lang="scss" scoped></style>
