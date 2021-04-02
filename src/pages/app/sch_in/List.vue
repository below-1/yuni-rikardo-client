<template>
  <q-page class="q-pa-xl">
    <q-toolbar class="bg-white">
      <q-toolbar-title class="text-weight-bold">Daftar Input Penjadwalan</q-toolbar-title>
      <q-space/>
      <q-input v-model="keyword" dense filled input-class="text-right" label="pencarian" class="q-mr-md" unelevated/>
      <q-btn to="/app/sch_in/create" color="green" icon="add" label="tambah" unelevated class="q-mr-md" />
      <q-btn @click="scheduleDialog = true" color="blue" icon="play_arrow" label="jadwalkan" unelevated />
    </q-toolbar>

    <q-dialog v-model="scheduleDialog">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Input Parameter PSO</div>
        </q-card-section>
        <q-card-section>
          <q-input class="q-mb-md" type="number" min="2" v-model.number="scheduleParams.n_particles" 
            label="Jumlah Particle" />
          <!-- <q-input class="q-mb-md" type="number" min="0" :step="0.01" v-model.number="scheduleParams.w" label="W" />
          <q-input class="q-mb-md" type="number" min="0" :step="0.01"  v-model.number="scheduleParams.c1" label="C1" />
          <q-input class="q-mb-md" type="number" min="0" :step="0.01" v-model.number="scheduleParams.c2" label="C2" />
          <q-input class="q-mb-md" type="number" min="0" v-model.number="scheduleParams.threshold" label="Threshold" /> -->
        </q-card-section>
        <q-card-section>
          <q-btn @click="createTask" dark color="blue" icon="play_circle" label="jalankan"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-my-md q-pa-sm bg-white">
      <div>Total Jam: {{total_jam}}</div>
    </div>

    <q-table
      :data="filtered"
      :columns="columns"
      row-key="id"
      class="q-mt-md"
      flat
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn 
            :to="`/app/mp/${props.row.id}/edit`"
            dense unelevated label="edit" color="blue" icon="edit" size="sm" class="q-mr-md"/>
          <q-btn 
            @click="confirmDelete(props.row.id)"
            dense unelevated label="hapus" color="red" icon="delete" size="sm"/>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ListGuru',
  data: () => ({
    scheduleDialog: false,
    scheduleParams: {
      w: 0.65,
      c1: 1.5,
      c2: 2,
      n_particles: 5,
      n_hourse: 40,
      threshold: 20
    },
  	items: [],
  	errors: null,
    keyword: '',
    columns: [
      {
        name: 'mp',
        required: true,
        label: 'Mata Pelajaran',
        align: 'left',
        field: 'mp_nama',
        sortable: true
      },
      {
        name: 'guru',
        required: true,
        label: 'Guru',
        align: 'left',
        field: 'guru_nama',
        sortable: true
      },
      {
        name: 'jam',
        required: true,
        label: 'Total Jam',
        align: 'left',
        field: 'jam',
        sortable: true
      },
      { name: 'actions', field: 'id' }
    ]
  }),
  computed: {
    ...mapState({
      user: state => state.user
    }),
    filtered () {
      const keyup = this.keyword.toUpperCase()
      return this.items.filter(it => {
        return it.mp_nama.toUpperCase().includes(keyup) || it.guru_nama.toUpperCase().includes(keyup)
      })
    },
    total_jam () {
      // console.log(this.items)
      console.log(this.items.map(it => it.jam))
      return this.items.map(it => it.jam).reduce((a, b) => a + b, 0)
    }
  },
  methods: {
    confirmDelete (id) {
      const item = this.items.find(it => it.id == id)
      if (!id) {
        throw new Error(`item with id=${id} can't be found`)
      }
      this.$q.dialog({
        dark: true,
        title: 'Konfirmasi',
        message: `Anda akan menghapus data mata pelajaran ${item.nama}`,
        cancel: true,
        persistent: true
      })
        .onOk(() => {
          this.deleteItem(id)
        })
    },
    async deleteItem (id) {
      const url = `/mp/${id}`
      try {
        await this.$api.delete(url)
        this.$q.notify({
          message: 'sukses menghapus data mata pelajaran',
          color: 'green'
        })
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal menghapus data mata pelajaran',
          color: 'red'
        })
      } finally {
        this.loadItems()
      }
    },
  	async loadItems () {
      const params = {
        id_app_user: this.user.id
      }
  		try {
  			this.$q.loading.show({ delay: 500 })
        const response = await this.$api.get('/input_sch', { params })
        this.items = response.data
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
  		} finally {
  			this.$q.loading.hide()
  		}
  	},
    async createTask () {
      const params = { id_app_user: this.user.id }
      const payload = { ...this.scheduleParams }
      try {
        const response = await this.$api.post('/scheduler_task', payload, { params })
        console.log(response.data)
        this.$q.notify({
          color: 'green-6',
          message: 'sukses menjalankan penjadwalan. Silahkan menunggu'
        })
      } catch (err) {
        console.log(err)
        this.$q.notify({
          color: 'red-6',
          message: 'gagal menjalankan penjadwalan'
        })
      }
    }
  },
  mounted () {
    this.loadItems()
  }
}
</script>
