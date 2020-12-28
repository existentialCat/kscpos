<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card max-width="450" class="mx-auto">
          <v-card-title>
            <h1 class="display-1">
              {{ isRegistering ? 'Register' : 'Login' }}
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form v-model="validForm">
              <v-text-field
                v-model="loginInfo.username"
                required
                :rules="emailRule"
                autocomplete="email username"
                label="Email"
                :prepend-icon="isRegistering ? '' : 'mdi-account-circle'"
              ></v-text-field>
              <v-text-field
                v-model="loginInfo.password"
                :type="showPassword ? 'text' : 'password'"
                required
                label="Password"
                :prepend-icon="isRegistering ? '' : 'mdi-lock'"
                autocomplete="new-password"
                :append-icon="
                  !isRegistering
                    ? showPassword
                      ? 'mdi-eye'
                      : 'mdi-eye-off'
                    : ''
                "
                @keyup.enter="submitform(loginInfo)"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-text-field
                v-if="isRegistering"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                :rules="passwordRule"
                label="Confirm Password"
                :prepend-icon="isRegistering ? '' : 'mdi-lock'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <!-- <v-btn
              v-if="!isRegistering"
              text
              @click="$router.push('/register')"
              >Register</v-btn
            > -->
            <v-spacer /><v-btn
              @click="
                isRegistering ? registerUser(loginInfo) : submitform(loginInfo)
              "
              >{{ isRegistering ? 'Create Account' : 'Login' }}</v-btn
            ></v-card-actions
          >
        </v-card>
        <div class="text-center">{{ loginerror }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    submitform: {
      type: Function,
      required: true,
    },
    buttonText: {
      type: String,
      default: 'Submit',
    },
  },
  data() {
    return {
      loginerror: null,
      validForm: false,
      validLogin: false,
      acceptTerms: false,
      showPassword: false,
      loginInfo: {
        username: '',
        password: '',
      },
      newEmail: '',
      password: '',
      confirmPassword: '',
      hasValueRule: [(value) => !!value || 'Please provide the required field'],
      emailRule: [
        (value) => !!value || 'Please provide the required information',
        (value) =>
          (value &&
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,24})+$/.test(value)) ||
          'Must be a valid email',
        (value) => value.includes('.') || 'Please enter at least one valid URL',
        (value) =>
          value.indexOf('.') <= value.length - 3 || 'Please enter a valid URL',
        (value) =>
          !value.includes(' ') || 'Please enter a valid URL without spaces',
      ],
      passwordRule: [
        (value) => !!value || 'Please provide the required information',
        (value) => value === this.loginInfo.password || 'Passwords must match',
      ],
    }
  },
  computed: {
    isRegistering() {
      return this.$route.path === '/register'
    },
  },
  methods: {
    peekAtTermsOfUse() {
      console.log('start modal')
    },
  },
}
</script>

<style lang="scss" scoped></style>
