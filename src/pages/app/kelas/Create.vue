<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Tambah Kelas</h6>
          </q-card-section>
          <q-card-section>
            <q-form ref="form" @submit="save">
              <div class="row q-mb-md">
                <div class="bg-grey-4 q-px-sm flex items-center col-2">
                  VII
                </div>
                <q-select
                  v-model="nama"
                  :options="options_kelas"
                  filled
                  dense
                  :rules="rules.nama"
                  style="padding-bottom: 0px;"
                  class="col-10"
                />
              </div>
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
    n_kelas: 13,
  	errors: null,
    rules: {
      nama: [
        (n => !!n || 'Nama kelas harus diisi')
      ]
    }
  }),
  computed: {
    ...mapState({
      user: state => state.user
    }),
    options_kelas () {
      let xs = []
      for (let i = 0; i < this.n_kelas; i++) {
        xs.push(65 + i);
      }
      return xs.map(x => String.fromCharCode(x))
    }
  },
  methods: {
  	async save () {
      const form_valid = this.$refs.form.validate()
      if (!form_valid) {
        alert('data tidak valid')
        return
      }
      const payload = {
        nama: 'VII ' + this.nama
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
