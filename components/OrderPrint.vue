<template>
  <v-card id="printMe" outlined>
    <v-card-text style="color: black; font-family: 'Roboto'">
      <v-container>
        <v-row align="center">
          <v-col>
            <v-row><h2>Check in Sheet</h2></v-row>
            <v-row>Date: {{ new Date(order.created).toLocaleString() }}</v-row>
            <v-row
              >ORDER ID:
              {{ order._id.substr(order._id.length - 7).toUpperCase() }}</v-row
            ></v-col
          ><v-col
            ><v-img contain max-width="200px" src="/logo.png"></v-img></v-col
          ><v-col>
            <v-row><h2>Keith Stone Computers</h2></v-row>
            <v-row>5220 Lewis Ave. Toledo, OH 43612</v-row>
            <v-row>419-214-0222</v-row>
            <v-row>KeithStoneComputers.com</v-row>
          </v-col></v-row
        >
        <v-row><h3>Customer</h3></v-row>
        <v-row>
          <v-col cols="12">
            <v-card outlined tile>
              <v-card-text style="color: black"
                ><v-row
                  ><v-col
                    >Checkin Date:
                    <b>{{ new Date(order.created).toLocaleString() }}</b></v-col
                  ><v-col
                    >Client: <b>{{ order.customer.fullName }}</b></v-col
                  ><v-col
                    >Main Phone: <b>{{ order.customer.phone }}</b></v-col
                  ></v-row
                ></v-card-text
              >
            </v-card></v-col
          ></v-row
        >
        <v-row style=""><h3>System</h3></v-row>
        <v-row>
          <v-col cols="12">
            <v-card outlined tile>
              <v-card-text style="color: black"
                ><v-row
                  ><v-col
                    >System Type: <b>{{ order.systems[0].sysType }}</b></v-col
                  ><v-col
                    >Brand: <b>{{ order.systems[0].brand }}</b></v-col
                  ><v-col
                    >Model: <b>{{ order.systems[0].model }}</b></v-col
                  ></v-row
                ></v-card-text
              >
            </v-card></v-col
          ></v-row
        >
        <v-row><h3>Problem</h3></v-row>
        <v-row>
          <v-col cols="12">
            <v-card outlined tile>
              <v-card-text style="color: black"
                ><v-row
                  ><v-col>
                    <b>{{ order.symptoms }}</b>
                  </v-col></v-row
                ></v-card-text
              >
            </v-card></v-col
          ></v-row
        >
        <v-row><h3>Additional Information</h3></v-row>
        <v-row>
          <v-col cols="12">
            <v-card outlined tile>
              <v-card-text style="color: black"
                ><v-row align="center"
                  ><v-col>Items Left: {{ order.itemsLeft[0] }}</v-col
                  ><v-col
                    >Data Important?
                    <v-icon>mdi-checkbox-blank-outline</v-icon></v-col
                  ><v-col
                    >Requires Password to Login?
                    <v-icon>mdi-checkbox-blank-outline</v-icon>
                  </v-col></v-row
                ></v-card-text
              >
            </v-card></v-col
          ></v-row
        >
        <v-row align="center"
          ><v-col
            >I have read, understand, and accept the terms and conditions stated
            on this receipt</v-col
          ><v-col>
            <v-text-field
              persistent-hint
              hint="Customer's Signature"
            ></v-text-field> </v-col
          ><v-col>
            <v-text-field persistent-hint hint="Date"></v-text-field> </v-col
        ></v-row>
        <v-row style=""><h3>Terms and Conditions</h3></v-row>
        <v-row
          ><v-col
            ><p style="font-size: x-small !important">
              No refunds, exchanges only. *FREE DIAGNOSTICS require a repair for
              it to be free. DIAGNOSTICS WILL BE $20 EACH FOR ALL DIAGNOSTICS
              WHEN NO REPAIR OF CURRENT CHECKED IN SYSTEM OR A SALE OF A SYSTEM.
              While every effort will be made to ensure data handling, Keith
              Stone Computers will not accept responsibility for the loss of
              data or programs. Customers are advised to backup any important
              data or retain their original setup disks for programs on their
              PC. Only after a complete diagnostic of the PC can the full extent
              of any problems be identified. The Diagnostics can take 1 to 3
              days and we will call the customer when the complete diagnostic
              has been performed. The customer can call after 3 business days to
              get the results of the diagnostic results. All repairs carry a 60
              day parts and labor warranty. Damage or defects, which are in our
              opinion, directly caused by incorrect or improper use, neglect or
              by mishandling by the user is specifically excluded from any
              warranty given or implied. Keith Stone Computers is not liable for
              any loss/damage of any items left here after 45 days. Any items
              left after 45 days will be disposed of, without any further notice
              (layaways are lost after 60 days). Keith Stone Computers, 5220
              Lewis Ave, Toledo, Ohio 43612, Phone: 419-214-0222
            </p></v-col
          ></v-row
        >
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
}
</script>
