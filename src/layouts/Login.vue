<template>
  <q-layout view="lHh Lpr lFf">
  	<q-page-container class="bg-grey-3">
      <q-page class="row justify-center items-center">
      	<div class="col">
      	</div>
      	<div class="col">
      		<q-card style="width: 100%;">
	  				<q-card-section>
		        	<div class="text-h4 text-center font-bold text-uppercase">simp</div>
		      	</q-card-section>
		      	<q-card-section>
		      		<q-form
		      			@submit="login"
		      		>
			      		<q-input label="username" filled class="q-mb-md" v-model="username" />
			      		<q-input label="password" type="password" filled v-model="password" />
			      		<q-btn 
			      			color="blue" 
			      			type="submit"
			      			class="text-white text-center q-my-md" style="width: 100%;" label="login" />
		      		</q-form>
		      	</q-card-section>
	      	</q-card>
      	</div>
      	<div class="col">
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