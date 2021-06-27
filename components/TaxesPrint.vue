<template>
  <v-card id="printMe" outlined>
    <v-card-text style="color: black; font-family: 'Roboto'">
      <v-container>
        <v-row align="center">
          <v-col>
            <v-row><h2>Monthly Tax Statement</h2></v-row>
            <v-row>{{ `For: ${selectrange}` }}</v-row> </v-col
          ><v-col
            ><v-img contain max-width="200px" src="/logo.png"></v-img></v-col
          ><v-col>
            <v-row><h2>Keith Stone Computers</h2></v-row>
            <v-row>5220 Lewis Ave. Toledo, OH 43612</v-row>
            <v-row>419-214-0222</v-row>
            <v-row>KeithStoneComputers.com</v-row>
          </v-col></v-row
        >
        <v-row
          ><b>Net Taxable Sales:</b>{{ ' ' }}{{ ` $${nettaxsales}` }}</v-row
        >
        <v-row
          ><b>Sales Tax Collected:</b> {{ ' '
          }}{{ ` $${salestaxcollected}` }}</v-row
        >
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    selectrange: {
      type: String,
      required: true,
    },
    nettaxsales: {
      type: String,
      required: true,
    },
    salestaxcollected: {
      type: String,
      required: true,
    },
  },
}
</script>
