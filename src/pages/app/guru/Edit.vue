<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Edit Data Guru</h6>
          </q-card-section>
          <q-card-section>
            <q-form ref="form" @submit="save">
              <q-input label="NIP" v-model="item.nip" filled class="q-mb-md" :rules="rules.nip" />
              <q-input label="Nama Guru" v-model="item.nama" filled class="q-mb-md" :rules="rules.nama" />
              <div class="q-mb-md">
                <label>Jenis Kelamin</label>
                <div class="q-gutter-sm">
                  <q-radio v-model="item.sex" val="Laki" label="Laki - Laki" />
                  <q-radio v-model="item.sex" val="Perempuan" label="Perempuan" />
                </div>
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
  name: 'CreateGuru',
  props: ['id'],
  data: () => ({
    item: {
      nama: '',
      sex: 'Laki',
      nip: '',
    },
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
  methods: {
    async loadItem () {
      const url = `/guru/${this.id}`
      try {
        const response = await this.$api.get(url)
        this.item = { ...response.data }
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal memuat data guru',
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
      const payload = { ...this.item }
      const url = `/guru/${this.id}`
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.put(url, payload)
        console.log(response.data)
        this.$q.notify({
          message: 'sukses mengubah data guru',
          color: 'green'
        })
        this.$router.back()
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
        this.$q.notify({
          message: 'gagal mengubah data guru',
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
