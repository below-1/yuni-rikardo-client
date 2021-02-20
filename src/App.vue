<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { prefix } from 'src/commons'

export default {
  name: 'App',
  mounted () {
  	const raw = localStorage.getItem(prefix('user'))
  	if (!raw) {
  		return
  	}
  	const user = JSON.parse(raw)
  	this.$store.commit('user/changeUser', user)
  }
}
</script>
