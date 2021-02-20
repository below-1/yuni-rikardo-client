<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Tambah Mata Pelajaran</h6>
          </q-card-section>
          <q-card-section>
            <q-form @submit="save">
              <q-input label="Nama" v-model="nama" filled class="q-mb-md" :rules="rules.nama" />
              <q-input label="Jam Per Minggu"
                type="number"
                v-model.number="jam_per_minggu" 
                filled 
                min=1
                class="q-mb-md" 
                :rules="rules.jam_per_minggu"
              />
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
  name: 'CreateGuru',
  data: () => ({
    nama: '',
    jam_per_minggu: 3,
  	errors: null,
    rules: {
      nama: [
        (n => !!n || 'Nama harus diisi')
      ],
      jam_per_minggu: [
        (n => !!n || 'Jam Per Minggu harus diisi')
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
      const params = { id_app_user: this.user.id }
      const payload = {
        nama: this.nama,
        jpm: this.jam_per_minggu
      }
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.post('/mp', payload, { params })
        console.log(response.data)
        this.$q.notify({
          message: 'sukses menambah data mata pelajaran',
          color: 'green'
        })
        this.$router.back()
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
        this.$q.notify({
          message: 'gagal menambah data mata pelajaran',
          color: 'red'
        })
  		} finally {
  			this.$q.loading.hide()
  		}
  	}
  }
}
</script>
