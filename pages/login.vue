<template>
  <v-container>
    <LoginForm :submitform="loginUser"></LoginForm>
  </v-container>
</template>

<script>
import LoginForm from '~/components/LoginForm.vue'
export default {
  layout: 'restrict',
  components: {
    LoginForm,
  },
  methods: {
    async loginUser(loginInfo) {
      try {
        console.log(this.$auth.loginWith)
        await this.$auth
          .loginWith('local', {
            data: loginInfo,
          })
          .then((req, res) => {
            if (this.$auth.loggedIn) {
              this.$router.push('/orders')
            }
          })
      } catch {
        console.log('login fail')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
