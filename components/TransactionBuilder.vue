<template>
  <v-stepper v-model="step" vertical>
    <v-col>
      <v-stepper-step :complete="step > 1" step="1">
        <slot name="step1title"></slot>
      </v-stepper-step>
      <v-stepper-items>
        <v-stepper-content step="1">
          <slot name="step1"></slot>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-step :complete="step > 2" step="2">
        <slot name="step2title"></slot>
      </v-stepper-step>
      <v-stepper-content step="2">
        <slot name="step2"></slot> </v-stepper-content
    ></v-col>
  </v-stepper>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },
}
</script>

<style lang="scss" scoped></style>
