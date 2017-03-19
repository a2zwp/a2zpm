// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
var routes = [
  // { path: '/foo', component: Projects },
  // { path: '/bar', component: Bar },
  { path: '/projects', component: ProjectAllListing },
  {
    path: '/project/:id', name: 'singleproject', component: SigleProject,
    children : [
        {
            path: 'tasklists',
            component: ProjectTasklists,
            children : [
                {
                    path: 'inbox',
                    component: SingleInboxTasklist
                },
                {
                    path: 'my-task',
                    component: SingleTaskList
                },

                {
                    path: 'pinned',
                    component: SingleTaskList
                },

                {
                    path: ':listID',
                    component: SingleTaskList
                },

                {
                    path: 'tasks/:taskID',
                    component: SingleTask
                },

            ]
        },

        {
            path: 'files',
            component: ProjectFiles
        }

    ]
  },
  { path: '/*', component: ProjectAllListing }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter({
    routes:routes // short for routes: routes
})
