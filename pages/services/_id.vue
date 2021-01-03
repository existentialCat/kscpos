<template>
  <v-container>
    <v-row>
      <v-btn text @click="$router.go(-1)">Return to Services</v-btn>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="1">
          <v-card-title
            >{{ nameEdit ? '' : service.name
            }}<v-text-field
              v-if="nameEdit"
              ref="name"
              v-model="newName"
            ></v-text-field
          ></v-card-title>
          <v-card-text>
            <v-row>
              <v-spacer /><v-btn
                v-if="nameEdit"
                text
                small
                @click="updateServ('name')"
                >Save</v-btn
              ><v-btn text small @click="editName">{{
                nameEdit ? 'Close' : 'Edit'
              }}</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4">
        <v-card elevation="1">
          <v-card-title>Categories</v-card-title>
          <v-card-text>
            <v-col v-for="keyword in service.categories" :key="keyword._id">{{
              keyword.name
            }}</v-col>
            <v-row v-if="categoriesEdit">
              <v-col v-if="categoriesEdit">
                <v-combobox
                  v-model="newCategories"
                  :items="categories"
                  item-text="name"
                  label="Categories"
                  multiple
                  outlined
                  dense
                ></v-combobox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-btn
            v-if="categoriesEdit"
            text
            small
            @click="updateServ('categories')"
            >Save</v-btn
          >
          <v-btn text small @click="editCategories">{{
            categoriesEdit ? 'Close' : 'Change or Add'
          }}</v-btn>
        </v-card>
      </v-col>
      <v-col lg="2">
        <v-card elevation="1">
          <v-card-title>Our Cost</v-card-title>
          <v-card-text>
            <v-row v-if="costEdit">
              <v-col v-if="costEdit">
                <v-text-field
                  ref="cost"
                  v-model="newCost"
                  label="Cost"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row
              ><v-col>{{ service.cost }}</v-col></v-row
            >
          </v-card-text>
          <v-btn v-if="costEdit" text small @click="updateServ('cost')"
            >Save</v-btn
          >
          <v-btn text small @click="editCost">{{
            costEdit ? 'Close' : 'Change'
          }}</v-btn>
        </v-card>
      </v-col>
      <v-col lg="2">
        <v-card elevation="1">
          <v-card-title>Sale Price</v-card-title>
          <v-card-text>
            <v-row v-if="priceEdit">
              <v-col v-if="priceEdit">
                <v-text-field
                  ref="price"
                  v-model="newPrice"
                  label="Price"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row
              ><v-col>{{ service.price }}</v-col></v-row
            >
          </v-card-text>
          <v-btn v-if="priceEdit" text small @click="updateServ('price')"
            >Save</v-btn
          >
          <v-btn text small @click="editPrice">{{
            priceEdit ? 'Close' : 'Change'
          }}</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      nameEdit: false,
      categoriesEdit: false,
      costEdit: false,
      priceEdit: false,
      newName: '',
      newCategories: [],
      newCost: '',
      newPrice: '',
    }
  },
  computed: {
    ...mapState(['service', 'categories']),
  },
  mounted() {
    this.fetchCategories()
    return this.fetchService(this.$route.params.id)
  },
  methods: {
    editName() {
      if (this.nameEdit) return (this.nameEdit = false)
      this.nameEdit = true
      this.$nextTick(() => this.$refs.name.focus())
      this.newName = this.service.name
    },
    editCategories() {
      if (this.categoriesEdit) return (this.categoriesEdit = false)
      this.categoriesEdit = true
      // this.$nextTick(() => this.$refs.name.focus())
      this.newCategories = this.service.categories
    },
    editCost() {
      if (this.costEdit) return (this.costEdit = false)
      this.costEdit = true
      this.$nextTick(() => this.$refs.cost.focus())
      this.newQty = this.service.cost
    },
    editPrice() {
      if (this.priceEdit) return (this.priceEdit = false)
      this.priceEdit = true
      this.$nextTick(() => this.$refs.price.focus())
      this.newQty = this.service.price
    },
    updateServ(field) {
      if (field === 'name') {
        const service = {
          _id: this.service._id,
          name: this.newName,
          brand: this.newBrand,
          model: this.newModel,
          sn: this.newSn,
          categories: this.service.categories,
          vendor: this.service.vendor,
          cost: this.service.cost,
          price: this.service.price,
          qty: this.service.qty,
        }
        this.nameEdit = false
        return this.updateService(service)
      }
      if (field === 'categories') {
        const service = {
          _id: this.service._id,
          name: this.service.name,
          brand: this.service.brand,
          model: this.service.model,
          sn: this.service.sn,
          categories: this.newCategories,
          vendor: this.service.vendor,
          cost: this.service.cost,
          price: this.service.price,
          qty: this.service.qty,
        }
        this.categoriesEdit = false
        return this.updateService(service)
      }
      if (field === 'cost') {
        const service = {
          _id: this.service._id,
          name: this.service.name,
          brand: this.service.brand,
          model: this.service.model,
          sn: this.service.sn,
          categories: this.service.categories,
          vendor: this.service.vendor,
          cost: this.newCost,
          price: this.service.price,
          qty: this.service.qty,
        }
        this.costEdit = false
        return this.updateService(service)
      }
      if (field === 'price') {
        const service = {
          _id: this.service._id,
          name: this.service.name,
          brand: this.service.brand,
          model: this.service.model,
          sn: this.service.sn,
          categories: this.service.categories,
          vendor: this.service.vendor,
          cost: this.service.cost,
          price: this.newPrice,
          qty: this.service.qty,
        }
        this.priceEdit = false
        return this.updateService(service)
      }
    },
    ...mapActions(['fetchService', 'fetchCategories', 'updateService']),
  },
}
</script>

<style lang="scss" scoped></style>
