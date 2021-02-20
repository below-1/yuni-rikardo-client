<template>
  <q-page>
    <div class="row q-pa-xl">
      <div class="col-5">
        <q-card flat>
          <q-card-section>
            <h6 class="q-ma-none q-pa-none">Form Tambah Input Jadwal</h6>
          </q-card-section>
          <q-card-section>
            <q-form @submit="save">
              <q-select emit-value map-options :options="options_guru" label="Guru" v-model.number="item.id_guru" filled class="q-mb-md" />
              <q-select emit-value map-options :options="options_mp" label="Mata Pelajaran" v-model.number="item.id_mata_pelajaran" filled class="q-mb-md" />
              <q-input 
                type="number" 
                min=2
                max=6
                label="Jumlah Jam Mengajar Per Minggu" 
                v-model.number="item.jam" 
                filled
                class="q-mb-md"
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
  name: 'CreateJadwalParam',
  data: () => ({
    nama: '',
    master: {
      mata_pelajaran: [],
      guru: [],
      kelas: []
    },
    item: {
      id_mata_pelajaran: null,
      id_guru: null,
      jam: 3
    },
    options: {
      mata_pelajaran: [],
      guru: []
    },
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
    }),
    scopedParams () {
      return { params: { id_app_user: this.user.id } }
    },
    options_mp () {
      return this.master.mata_pelajaran.map(it => ({
        label: it.nama,
        value: it.id
      }))
    },
    options_guru () {
      return this.master.guru.map(it => ({
        label: it.nama,
        value: it.id
      }))
    },
    selected_guru () {
      if (!this.item.id_guru) return null
      return this.master.guru.find(it => it.id == this.id_guru)
    },
    selected_mp () {
      if (!this.item.id_mata_pelajaran) return null
      return this.master.mata_pelajaran.find(it => it.id == this.id_mata_pelajaran)
    },
    max_hours () {
      if (!selected_mp) return null
      return selected_mp.jam_per_minggu * this.kelas.length
    }
  },
  methods: {
    async loadGuru () {
      try {
        const response = await this.$api.get('/guru', this.scopedParams)
        this.master.guru = response.data
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal memuat data guru'
        })
      }
    },
    async loadMataPelajaran () {
      try {
        const response = await this.$api.get('/mp', this.scopedParams)
        this.master.mata_pelajaran = response.data
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal memuat data mata_pelajaran'
        })
      }
    },
    async loadKelas () {
      try {
        const response = await this.$api.get('/kelas', this.scopedParams)
        this.master.kelas = response.data
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal memuat data kelas'
        })
      }
    },
  	async save () {
      const params = { id_app_user: this.user.id }
      const payload = { ...this.item }
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.post('/input_sch', payload, { params })
        // console.log(response.data)
        this.$q.notify({
          message: 'sukses menambah data input penjadwalan',
          color: 'green'
        })
        this.$router.back()
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
        this.$q.notify({
          message: 'gagal menambah data input penjadwalan',
          color: 'red'
        })
  		} finally {
  			this.$q.loading.hide()
  		}
  	}
  },
  async mounted () {
    await this.loadGuru()
    await this.loadMataPelajaran()
  }
}
</script>
