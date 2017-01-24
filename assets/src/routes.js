// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  // { path: '/foo', component: Projects },
  // { path: '/bar', component: Bar },
  { path: '/*', component: ProjectAllListing }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes:routes // short for routes: routes
})
