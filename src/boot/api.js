import axios from 'axios'

export default function ({ Vue }) {
	Vue.prototype.$api = axios.create({
	  baseURL: 'http://localhost:5000/v1/api'
	})
}

