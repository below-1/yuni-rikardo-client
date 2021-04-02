<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-grey-1 q-py-md text-grey-10 q-px-xl" style="height: 4rem;">
        <q-toolbar-title class="text-uppercase">
          dashboard
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

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">{{ user.username }}</div>

              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
                @click="logout"
              />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      dark
    >
      <q-list>
        <q-item
          clickable
          tag="a"
          class="bg-orange-10 text-white"
          style="height: 4rem;"
        >
          <q-item-section
            avatar
          >
            <q-icon name="qr_code" color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-uppercase text-h6 font-bold">simp</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
        <template v-for="link in essentialLinks">
          <q-item
            clickable
            tag="a"
            :to="link.link"
            :key="link.title"
            class="q-py-4"
          >
            <q-item-section
              v-if="link.icon"
              avatar
            >
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-uppercase ">{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import EssentialLink from 'components/EssentialLink.vue'
import { prefix } from 'src/commons'

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
    link: '/app/sch_in'
  },
  {
    title: 'Proses',
    caption: 'olah proses penjadwalan',
    icon: 'chat',
    link: '/app/sch'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  methods: {
    logout () {
      localStorage.removeItem(prefix('user'))
      this.$router.replace('/')
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  }
}
</script>
