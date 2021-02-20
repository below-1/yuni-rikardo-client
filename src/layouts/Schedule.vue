<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-btn to="/app" flat icon="keyboard_backspace">
        </q-btn>
        <q-toolbar-title class="text-uppercase">
          Hasil Penjadwalan
        </q-toolbar-title>

        <div class="q-mr-md">Quasar v{{ $q.version }}</div>
        <q-btn-dropdown
          class="glossy"
          color="blue"
          :label="user.username"
          icon="account_circle"
          fab
          dense
          padding="4px"
          depressed
        >
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">Settings</div>
              <q-toggle label="Use Mobile Data" />
              <q-toggle label="Bluetooth" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
              />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <q-page class="q-pa-none">
        <div class="q-pa-none">
          <q-table
            class="my-sticky-header-column-table"
            unelevated
            :data="data"
            :columns="columns"
            row-key="name"
            :rows-per-page-options="[0]"
          >
            <template v-slot:body="props">
              <q-tr v-if="props.row.separator">
                <q-td 
                  style="background: rgb(245, 245, 245) !important; font-weight: bold; font-size: 14px;" 
                  :colspan="kelas_list.length"
                >{{ props.row.hari }}</q-td>
              </q-tr>
              <q-tr v-else :props="props">
                <q-td key="label" :props="props">
                  {{props.row.label}}
                </q-td>
                <template v-for="(k, j) in kelas_list">
                  <q-td :key="`sch-col-${j}`" class="text-center sch-col">
                    <div class="text-grey-9">{{props.row[k.id].guru.nama}}</div>
                    <div class="text-grey-9">{{props.row[k.id].mp.nama}}</div>
                  </q-td>
                </template>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
  .my-sticky-header-column-table {
    /* height or max-height is important */
    height: calc(100vh - 4rem);
    /* specifying max-width so the example can
      highlight the sticky column on any browser window */
    max-width: 100vw;
    /* this will be the loading indicator */;
  }

  .my-sticky-header-column-table td:first-child {
      /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important;
  }

  .my-sticky-header-column-table tr th {
    position: sticky;
      /* higher than z-index for td below */
    z-index: 2;
      /* bg color is important; just specify one */
    background: #fff;
  }

  .my-sticky-header-column-table thead tr:last-child th {
      /* height of all previous header rows */
    top: 48px;
      /* highest z-index */
    z-index: 3;
  }

  .my-sticky-header-column-table thead tr:first-child th {
    top: 0;
    z-index: 1;
  }

  .my-sticky-header-column-table tr:first-child th:first-child {
      /* highest z-index */
    z-index: 3;
  }

  .my-sticky-header-column-table td:first-child {
    z-index: 1;
  }

  .my-sticky-header-column-table td:first-child, .my-sticky-header-column-table th:first-child {
    position: sticky;
    left: 0;
  }

  .sch-col {
    border-left: 1px solid rgb(245, 245, 245) !important;
    border-right: 1px solid rgb(245, 245, 245) !important;
    font-size: 11px !important;
    font-weight: bold;
  }

  .sch-col:hover {
    background: #80d8ff!important;
  }
</style>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Guru',
    caption: 'olah data guru',
    icon: 'school',
    link: '/app/guru'
  },
  {
    title: 'Mata Pelajaran',
    caption: 'olah data mata pelajaran',
    icon: 'code',
    link: '/app/mp'
  },
  {
    title: 'Kelas',
    caption: 'olah data mata pelajaran',
    icon: 'code',
    link: '/app/kelas'
  },
  {
    title: 'Penjadwalan',
    caption: 'olah data penjadwalan',
    icon: 'chat',
    link: '/app/scheduler'
  },
  {
    title: 'Akun',
    caption: 'olah data akun',
    icon: 'record_voice_over',
    link: '/app/account'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

const hari_map = {
  0: 'senin',
  1: 'selasa',
  2: 'rabu',
  3: 'kamis',
  4: 'jumat',
  5: 'sabtu'
}

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  props: ['task_id'],
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      kelas_list: [],
      columns: [
        {
          name: 'label',
          required: true,
          label: 'Hari Jam',
          align: 'left',
          field: row => row.label,
          format: val => `${val}`,
          sortable: true
        }
      ],
      data: []
    }
  },
  methods: {
    async loadScheduleMock () {
      const response = await this.$api.get(`/scheduler_task/${this.task_id}`)
      const mp_guru_list = response.data.args.mp_guru_list
      const mp_list = response.data.args.mp_list
      const kelas_list = response.data.args.kelas_list
      const bobot_hari = response.data.args.bobot_hari
      const data = response.data.result
      this.columns = [
        ...this.columns,
        ...(kelas_list.map((it, index) => {
          return {
            name: `sch-col-${index}`,
            required: true,
            label: it.nama,
            align: 'center',
            sortable: false
          }
        }))
      ]
      this.kelas_list = kelas_list

      const res = data.result
      let xs = []
      bobot_hari.forEach(bh => {
        xs.push({ separator: true, hari: hari_map[bh.hari] })
        for (let i = 0; i < bh.max; i++) {
          let x = {
            label: `jam-${i+1}`
          }
          for (let kelas of kelas_list) {
            let slot = res.find(it => {
              const same_day = it.hari == bh.hari
              const in_hours = i >= it.t0 && i <= it.t1;
              return same_day && in_hours && it.kelas == kelas.id
            })
            if (!slot) {
              throw new Error('invalid')
            }
            let sl_id_guru = slot.guru
            let sl_id_mp = slot.mp
            let sl_guru = mp_guru_list.find(mpg => {
              return mpg.guru_id == sl_id_guru
            })
            let sl_mp = mp_list.find(mp => {
              return mp.id == sl_id_mp
            })
            // console.log(mp_guru_list)
            x[kelas.id] = {}
            const guru = {
              id: sl_guru.guru_id,
              nama: sl_guru.guru_nama
            }
            const mp = {
              id: sl_mp.id,
              nama: sl_mp.nama
            }
            x[slot.kelas] = {
              mp,
              guru
            }
          }
          let slots = res.filter(it => {
            const same_day = it.hari == bh.hari
            const in_hours = it.t0 >= i && it.t1 <= i;
            return same_day
          })
          kelas_list.forEach(k => {
            slots.find(sl => sl.kelas == k.id)
          })
          xs.push(x)
        }
      })

      this.data = xs
    }
  },
  mounted () {
    this.loadScheduleMock()
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>
