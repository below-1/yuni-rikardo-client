<template>
  <q-page class="q-pa-xl">
    <q-toolbar class="bg-white">
      <q-toolbar-title class="text-weight-bold">Tasks</q-toolbar-title>
      <q-space/>
    </q-toolbar>

    <q-table
      :data="filtered"
      :columns="columns"
      row-key="id"
      class="q-mt-md"
      flat
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="text-center" v-if="props.row.status == 'ready'">
            <div>Ready</div>
            <q-linear-progress indeterminate rounded color="accent" class="q-mt-sm" />
          </div>
          <div class="text-center" v-if="props.row.status == 'running'">
            <div>Running</div>
            <q-linear-progress indeterminate rounded color="blue" class="q-mt-sm" />
          </div>
          <div class="text-center text-weight-bolder text-green-7" v-if="props.row.status == 'done'">
            <div>Done</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn 
            @click="confirmDelete(props.row.id)"
            dense unelevated label="hapus" color="red" icon="delete" size="sm" class="q-mr-md"/>
          <q-btn 
            :to="`/schedule/${props.row.id}`"
            dense unelevated label="hasil" color="blue" icon="table_view" size="sm"/>
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
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true
      },
      {
        name: 'w',
        required: true,
        label: 'W',
        align: 'left',
        field: t => t.args.w,
        sortable: true
      },
      {
        name: 'c1',
        required: true,
        label: 'C1',
        align: 'left',
        field: t => t.args.c1,
        sortable: true
      },
      {
        name: 'c2',
        required: true,
        label: 'C2',
        align: 'left',
        field: t => t.args.c2,
        sortable: true
      },
      {
        name: 'n',
        required: true,
        label: 'N Particles',
        align: 'left',
        field: t => t.args.n_particles,
        sortable: true
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'status',
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
      return this.items
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
        message: `Anda akan menghapus process#${item.id}`,
        cancel: true,
        persistent: true
      })
        .onOk(() => {
          this.deleteItem(id)
        })
    },
    async deleteItem (id) {
      const url = `/scheduler_task/${id}`
      try {
        await this.$api.delete(url)
        this.$q.notify({
          message: 'sukses menghapus prosess',
          color: 'green'
        })
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'gagal menghapus data proses',
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
        const response = await this.$api.get('/scheduler_task', { params })
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
