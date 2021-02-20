export function changeUser (state, payload) {
	state.id = payload.id
	state.username = payload.username
	state.nama_sekolah = payload.nama_sekolah
	state.alamat_sekolah = payload.alamat_sekolah
}
