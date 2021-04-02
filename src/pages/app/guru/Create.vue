<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Tambah Data Guru</h6>
          </q-card-section>
          <q-card-section>
            <q-form ref="form" @submit="save">
              <q-input label="NIP"
                v-model="nip" 
                filled class="q-mb-md" 
                :rules="rules.nip" />
              <q-input label="Nama Guru" v-model="nama" filled class="q-mb-md" :rules="rules.nama" />
              <div class="q-mb-md">
                <label>Jenis Kelamin</label>
                <div class="q-gutter-sm">
                  <q-radio v-model="sex" val="Laki" label="Laki - Laki" />
                  <q-radio v-model="sex" val="Perempuan" label="Perempuan" />
                </div>
              </div>
              <div>
                <q-btn 
                  label="simpan" 
                  type="submit" 
                  color="blue" 
                  depressed 
                  class="q-mr-md"></q-btn>
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
    sex: 'Laki',
    nip: '',
  	items: [],
  	errors: null,
    rules: {
      nama: [
        (n => !!n || 'Nama harus diisi')
      ],
      nip: [
        (n => !!n || 'NIP harus diisi'),
        (n => n.length == 20 || 'NIP harus 20 karakter'),
        (n => n.match(nip_pattern) || 'NIP berupa digit')
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
      const form_valid = this.$refs.form.validate()
      if (!form_valid) {
        alert('data tidak valid')
        return
      }
      const payload = {
        nama: this.nama,
        nip: this.nip,
        sex: this.sex,
        id_app_user: this.user.id
      }
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.post('/guru', payload)
        console.log(response.data)
        this.$q.notify({
          message: 'sukses menambah data guru',
          color: 'green'
        })
        this.$router.back()
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
        this.$q.notify({
          message: 'gagal menambah data guru',
          color: 'red'
        })
  		} finally {
  			this.$q.loading.hide()
  		}
  	}
  }
}
</script>
