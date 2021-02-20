<template>
  <q-page class="q-pa-xl">
    <q-toolbar class="bg-white">
      <q-toolbar-title class="text-weight-bold">Daftar Mata Pelajaran</q-toolbar-title>
      <q-space/>
      <q-input v-model="keyword" dense filled input-class="text-right" label="pencarian" class="q-mr-md" unelevated/>
      <q-btn to="/app/mp/create" color="green" icon="add" label="tambah mata pelajaran" unelevated />
    </q-toolbar>

    <q-table
      :data="filtered"
      :columns="columns"
      row-key="id"
      class="q-mt-md"
      :rows-per-page-options="[0]"
      flat
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
  	items: [],
  	errors: null,
    keyword: '',
    columns: [
      {
        name: 'nama',
        required: true,
        label: 'nama',
        align: 'left',
        field: 'nama',
        sortable: true,
        style: 'font-family: monospace'
      },
      {
        name: 'jam_per_minggu',
        required: true,
        label: 'Total Jam',
        align: 'left',
        field: 'jpm',
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
        return it.nama.toUpperCase().includes(keyup)
      })
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
        const response = await this.$api.get('/mp', { params })
        this.items = response.data
  		} catch (err) {
  			console.log(err)
  			this.errors = 'terjadi kesalahan'
  		} finally {
  			this.$q.loading.hide()
  		}
  	}
  },
  mounted () {
    this.loadItems()
  }
}
</script>
