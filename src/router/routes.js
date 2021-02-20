
const routes = [
  {
    path: '/auth/login',
    component: () => import('layouts/Login.vue')
  },
  {
    path: '/schedule/:task_id',
    component: () => import('layouts/Schedule.vue'),
    props: true
  },
  {
    path: '/auth/register',
    component: () => import('layouts/Register.vue')
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'guru', component: () => import('pages/app/guru/List.vue') },
      { path: 'guru/create', component: () => import('pages/app/guru/Create.vue') },
      { path: 'guru/:id/edit', component: () => import('pages/app/guru/Edit.vue'), props: true },
      { path: 'mp', component: () => import('pages/app/mp/List.vue') },
      { path: 'mp/create', component: () => import('pages/app/mp/Create.vue') },
      { path: 'mp/:id/edit', component: () => import('pages/app/mp/Edit.vue'), props: true },
      { path: 'kelas', component: () => import('pages/app/kelas/List.vue') },
      { path: 'kelas/create', component: () => import('pages/app/kelas/Create.vue') },
      { path: 'kelas/:id/edit', component: () => import('pages/app/kelas/Edit.vue'), props: true },
      { path: 'sch_in', component: () => import('pages/app/sch_in/List.vue') },
      { path: 'sch_in/create', component: () => import('pages/app/sch_in/Create.vue') },
      { path: 'sch', component: () => import('pages/app/sch/List.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
