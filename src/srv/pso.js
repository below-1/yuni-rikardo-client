import { sampleSize, sample, sum } from 'lodash'

function expand_sch_in (sch_ins) {
	let result = [];
	let id = 1;
	for (let sch in sch_ins) {
		if (sch.jam == 3) {
			let mp_guru = { ...sch };
			mp_guru.id = id;
			id += 1;
			result.push(mp_guru);
		} else if (sch.jam == 4) {
			let new_mp_guru = { ...sch }
			new_mp_guru.id = id;
			new_mp_guru.jam = 2;
			id += 1;
			let mp_guru = { ...sch }
			mp_guru.id = id;
			mp_guru.jam = 2;
			id += 1;
			result.push(new_mp_guru);
			result.push(mp_guru);
		} else {
			let new_mp_guru = { ...sch }
			new_mp_guru.id = id;
			new_mp_guru.jam = sch.jam - 3;
			id += 1;
			let mp_guru = { ...sch }
			mp_guru.id = id;
			mp_guru.jam = 3;
			id += 1;
			result.push(new_mp_guru);
			result.push(mp_guru);
		}
	}
	return result;
}

function create_mp_length_map (mp_gurus) {
	let result = new Map();
	for (let mp_guru of mp_gurus) {
		if (!result.has(mp_guru.jam)) {
			result.set(mp_guru.jam, 0)
		}
		const curr = result.get(mp_guru.jam)
		result.set(mp_guru.jam, curr + 1)
	}
	return result
}

function sample_n_hours (mp_gurus, n_hours) {
	// we're changing n in [2, 3, 4] for each iteration
	// to cover all differences in day length.
	// we also ensure there is not repeated id_mp for a given day
	let n = sample([ 2, 3, 4 ])
	let sms = sampleSize(mp_gurus, n)
	let list_id_mp = sms.map(it => it.id_mp)
	if ()
}

export function pso (options) {
	if (!options.sch_ins) throw new Error(`options.sch_ins cant be empty`);
	if (!options.map_day_length) throw new Error(`options.map_day_length cant be empty`);
	const sch_ins = options.sch_ins;
	const map_day_length = options.map_day_length;
	const mp_gurus = expand_sch_in(sch_ins);
	let map_mp_length = create_mp_length_map(mp_gurus);
}