<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Edit Data Kelas</h6>
          </q-card-section>
          <q-card-section>
            <q-form @submit="save">
              <q-input label="Nama Guru" v-model="item.nama" filled class="q-mb-md" :rules="rules.nama" />
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
  methods: {
    async loadItem () {
      const url = `/kelas/${this.id}`
      try {
        const response = await this.$api.get(url)
        const { data } = response
        this.item = {
          nama: data.nama
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
      const payload = { ...this.item }
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
