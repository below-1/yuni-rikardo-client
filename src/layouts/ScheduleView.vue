<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-btn to="/app" flat icon="keyboard_backspace">
        </q-btn>
        <q-toolbar-title class="text-uppercase">
          Hasil Penjadwalan
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-none">
        <div class="q-pa-none">
          <q-table
            class="my-sticky-header-column-table"
            id="schedule_table"
            unelevated
            :data="data"
            :columns="columns"
            row-key="name"
            :rows-per-page-options="[0]"
            :hide-pagination="true"
            :dense="true"
            :flat="true"
            :wrap-cells="true"
          >
            <template v-slot:body="props">

              <template v-if="props.row.separator">
                <q-tr :key="`sch-row-separator-${props.row.hari}`" >
                  <q-td class="text-bold text-lg">
                    {{props.row.hari}}
                  </q-td>
                  <q-td :colspan="columns.length - 1" class="bg-grey-2">
                  </q-td>
                </q-tr>
              </template>
              <template v-else>
                <q-tr>
                  <q-td 
                    :key="`sch-row-head-${props.row.hari}-${props.row.slots.join('_')}`" 
                  >
                    {{ props.row.slots[0] }}
                  </q-td>
                  <template v-for="(row, j) in props.row.rows">
                    <q-td 
                      :key="`sch-col-${props.row.hari}-${props.row.i}-${j}`" 
                      :class="`text-center sch-col guru_${row.guru.id}`"
                      :rowspan="row.jam"
                      @mouseover="tdMouseIn(row.guru.id)"
                      @mouseleave="tdMouseOut(row.guru.id)"
                    >
                      <div class="text-grey-9">{{row.guru.nama}}</div>
                      <div class="text-grey-9">{{row.mp.nama}}</div>
                    </q-td>
                  </template>
                </q-tr>
                <template v-for="n in (props.row.jam - 1)">
                  <q-tr :key="`sch-row-fill-${props.row.hari}-${n + props.row.slots[0]}`">
                    <q-td>
                      {{ n + props.row.slots[0] }}
                    </q-td>
                  </q-tr>
                </template>
              </template>

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
    font-weight: bold;
    font-size: 11px !important;
  }
</style>

<script>
import EssentialLink from 'components/EssentialLink.vue'

function selectColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,75%)`;
}

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
          label: 'Hari',
          align: 'left'
        }
      ],
      data: [],
      all_guru: {},
      all_mp: {},
      hari_map,
      swap_pairs: []
    }
  },
  methods: {
    async loadScheduleMock () {
      const response = await this.$api.get(`/scheduler_task/${this.task_id}`)
      const kelas_list = response.data.args.kelas_list
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
      let last_day = null
      let hari_slot_counter = 1
      console.log(response.data.result)

      let data = []

      response.data.result.forEach(record => {
        record.rows = record.rows.map(row => ({
          ...row,
          guru: this.all_guru[row.guru_id],
          mp: this.all_mp[row.mp_id]
        }))
        if (last_day != record.hari) {
          record.hari_format = this.hari_map[record.hari]
          last_day = record.hari
          hari_slot_counter = 1
          data.push({ separator: true, hari: this.hari_map[record.hari] })
        }
        let slots = []
        for (let i = 0; i < record.jam; i++) {
          slots.push(i + hari_slot_counter);
        }
        hari_slot_counter = slots[slots.length - 1] + 1
        record.slots = slots
        data.push(record)
      })

      this.data = data
      console.log(this.data)
    },
    async loadAllGuru () {
      const params = {
        id_app_user: this.user.id
      }
      const response = await this.$api.get('/guru', { params })
      let all_guru = {}
      response.data.forEach((guru, i) => {
        guru.color = selectColor(i + 1)
        all_guru[guru.id] = guru
      })
      this.all_guru = all_guru
    },
    async loadAllMp () {
      const params = {
        id_app_user: this.user.id
      }
      const response = await this.$api.get('/mp', { params })
      let all_mp = {}
      response.data.forEach(mp => {
        all_mp[mp.id] = mp
      })
      this.all_mp = all_mp
    },
    tdMouseIn(guru_id) {
      const table = document.getElementById('schedule_table')
      const tds = table.querySelectorAll(`.guru_${guru_id}`)
      tds.forEach(el => {
        el.style.backgroundColor = this.all_guru[guru_id].color
      })
    },
    tdMouseOut(guru_id) {
      const table = document.getElementById('schedule_table')
      const tds = table.querySelectorAll(`.guru_${guru_id}`)
      tds.forEach(el => {
        el.style.backgroundColor = null
      })
    }
  },
  async mounted () {
    await this.loadAllMp()
    await this.loadAllGuru()
    await this.loadScheduleMock()
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>
