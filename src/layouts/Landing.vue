<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container 
      style="background-image: url('/bg.jpg'); background-size: cover;"
    >
      <q-page class="column">
        <div class="row justify-center items-center q-py-xl">
          <div class="col-1"></div>
          <div class="col-5">
            <div class="text-white" style="font-size: 1.6rem; font-weight: 800;">SMP Negeri 6</div>
          </div>
          <div class="col-5 text-right">
            <a 
              href="https://web.facebook.com/yuniie.rickhardo"
              target="_blank"
              class="text-white" style="font-size: 1.6rem; font-weight: 800;">
              About me
            </a>
          </div>
          <div class="col-1"></div>
        </div>

        <div class="row justify-center items-center flex-grow">
          <div class="col-1">
          </div>
          <div class="col-5">
            <div class="text-white text-uppercase" style="font-size: 4rem; font-weight: 1000;">penjadwalan</div>
            <div class="text-h4 font-weight-bold text-white text-uppercase q-mb-md">mata pelajaran smp</div>
            <div class="text-white font-weight-regular" style="font-size: 1.2rem;">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
          <div class="col-6"></div>
        </div>

        <div class="row justify-center items-center q-py-xl">
          <div class="col-1"></div>
          <div class="col-5">
            <q-btn to="/auth/login" outline rounded color="white" label="Login Sekarang" 
              size="1.6rem" 
              style="font-weight: 800" />
          </div>
          <div class="col-6"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { prefix } from 'src/commons'

export default {
  data: () => ({
    username: '',
    password: '',
    network: 'idle',
    errors: null
  }),
  methods: {
    async login () {
      const payload = {
        username: this.username,
        password: this.password
      }
      try {
        this.$q.loading.show({ delay: 500 })
        const response = await this.$api.post('/account/login', payload)
        const { data: user } = response
        localStorage.setItem(prefix('user'), JSON.stringify(user))
        this.$store.commit('user/changeUser', user)
        this.$router.replace('/app')
        console.log(response.data)
      } catch (err) {
        console.log(err)
      } finally {
        this.$q.loading.hide()
      }
    }
  },
  mounted () {
    console.log('this.$store')
    console.log(this.$store)
    console.log('this.$store.user')
    console.log(this.$store.user)
  }
}
</script>