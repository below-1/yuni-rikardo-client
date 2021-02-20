<template>
  <q-page class="q-pa-xl">
    <q-toolbar class="bg-white">
      <q-toolbar-title class="text-weight-bold">Daftar Guru</q-toolbar-title>
      <q-space/>
      <q-input v-model="keyword" dense filled input-class="text-right" label="pencarian" class="q-mr-md" unelevated/>
      <q-btn to="/app/guru/create" color="green" icon="add" label="tambah guru" unelevated />
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
            :to="`/app/guru/${props.row.id}/edit`"
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
        name: 'nip',
        required: true,
        label: 'NIP',
        align: 'left',
        field: 'nip',
        sortable: true
      },
      {
        name: 'nama',
        required: true,
        label: 'Nama',
        align: 'left',
        field: 'nama',
        sortable: true
      },
      {
        name: 'sex',
        required: true,
        label: 'jenis kelamin',
        align: 'left',
        field: 'sex',
        format: v => v == 'Laki' ? 'laki - laki' : 'perempuan',
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
        return it.nama.toUpperCase().includes(keyup) || it.nip.toUpperCase().includes(keyup)
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
        message: `Anda akan menghapus data guru ${item.nama}`,
        cancel: true,
        persistent: true
      })
        .onOk(() => {
          this.deleteItem(id)
        })
    },
    async deleteItem (id) {
      const url = `/guru/${id}`
      try {
        await this.$api.delete(url)
        this.$q.notify({
          message: 'sukses menghapus data guru',
          color: 'green'
        })
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal menghapus data guru',
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
        const response = await this.$api.get('/guru', { params })
        this.items = response.data
        console.log(this.items)
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
