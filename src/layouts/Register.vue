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
		      			@submit="register"
		      		>
			      		<q-input label="username" filled class="q-mb-md" v-model="username" />
			      		<q-input label="password" type="password" filled v-model="password" class="q-mb-md" />
			      		<q-input label="nama sekolah" filled v-model="nama_sekolah" class="q-mb-md" />
			      		<q-input label="alamat sekolah" filled v-model="alamat_sekolah" />
			      		<q-btn 
			      			color="blue" 
			      			type="submit"
			      			class="text-white text-center q-my-md" style="width: 100%;" label="register" />
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
export default {
	name: 'Register',
	data: () => ({
		username: '',
		password: '',
		nama_sekolah: '',
		alamat_sekolah: '',
		network: 'idle',
		errors: null
	}),
	methods: {
		async register () {
			const payload = {
				username: this.username,
				password: this.password,
				nama_sekolah: this.nama_sekolah,
				alamat_sekolah: this.alamat_sekolah
			}
			try {
				this.network = 'loading'
				this.$q.loading.show()
				const response = await this.$api.post('/account/register', payload)
				console.log(response.data)
				this.network = 'done'
			} catch (err) {
				console.log(err)
				this.network = 'error'
				this.errors = 'terjadi kesalahan'
			} finally {
				this.$q.loading.hide()
			}
		}
	}
}
</script>