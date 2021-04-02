<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Edit Data Kelas</h6>
          </q-card-section>
          <q-card-section>
            <q-form ref="form" @submit="save">
              <div class="row q-mb-md">
                <div class="bg-grey-4 q-px-sm flex items-center col-2">
                  VII
                </div>
                <q-select
                  v-model="item.nama"
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
const nip_pattern = /^\d+$/;

export default {
  name: 'EditKelas',
  props: ['id'],
  data: () => ({
    n_kelas: 13,
    item: {
      nama: ''
    },
  	errors: null,
    rules: {
      nama: [
        (n => !!n || 'Nama harus diisi')
      ]
    }
  }),
  computed: {
    options_kelas () {
      let xs = []
      for (let i = 0; i < this.n_kelas; i++) {
        xs.push(65 + i);
      }
      return xs.map(x => String.fromCharCode(x))
    }
  },
  methods: {
    async loadItem () {
      const url = `/kelas/${this.id}`
      try {
        const response = await this.$api.get(url)
        const { data } = response
        this.item = {
          nama: data.nama.split(' ')[1]
        }
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal memuat data kelas',
          color: 'red'
        })
      }
    },
  	async save () {
      const form_valid = this.$refs.form.validate()
      if (!form_valid) {
        alert('data tidak valid')
        return
      }
      const payload = { nama: 'VII ' + this.item.nama }
      const url = `/kelas/${this.id}`
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.put(url, payload)
        console.log(response.data)
        this.$q.notify({
          message: 'sukses mengubah data kelas',
          color: 'green'
        })
        this.$router.back()
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
        this.$q.notify({
          message: 'gagal mengubah data kelas',
          color: 'red'
        })
  		} finally {
  			this.$q.loading.hide()
  		}
  	}
  },
  mounted () {
    this.loadItem()
  }
}
</script>
