<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Tambah Kelas</h6>
          </q-card-section>
          <q-card-section>
            <q-form @submit="save">
              <q-input label="Nama" v-model="nama" filled class="q-mb-md" :rules="rules.nama" />
              <div>
                <q-btn label="simpan" type="submit" color="blue" depressed class="q-mr-md"></q-btn>
                <q-btn label="reset" type="reset" depressed></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

const nip_pattern = /^\d+$/;

export default {
  name: 'CreateKelas',
  data: () => ({
    nama: '',
  	errors: null,
    rules: {
      nama: [
        (n => !!n || 'Nama harus diisi')
      ]
    }
  }),
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
  	async save () {
      const payload = {
        nama: this.nama
      } 
      const params = {
        id_app_user: this.user.id
      }
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.post('/kelas', payload, { params  })
        console.log(response.data)
        this.$q.notify({
          message: 'sukses menambah data kelas',
          color: 'green'
        })
        this.$router.back()
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
        this.$q.notify({
          message: 'gagal menambah data kelas',
          color: 'red'
        })
  		} finally {
  			this.$q.loading.hide()
  		}
  	}
  }
}
</script>
