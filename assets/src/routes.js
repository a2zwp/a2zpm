// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
var routes = [
    { path: '/projects', component: ProjectAllListing, name: 'a2zpm_all_project',
        children: [
            { path: 'add', component: ProjectAdd, name: 'a2zpm_project_add' },
            { path: 'edit/:id', component: ProjectEdit, name: 'a2zpm_project_edit' },
            { path: 'team/:id', component: ProjectManageTeam, name: 'a2zpm_project_manage_team' },
        ]
    },


    {
        path: '/project/:id', component: SigleProject,
        children : [
            { path: '/', name: 'project_tasklists', component: ProjectTasklists },
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

                ],
            },
            {
                path: 'files',
                component: ProjectFiles
            }
        ]
    },
    { path: '/', component: ProjectAllListing, name: 'a2zpm_home' }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter({
    routes:routes // short for routes: routes
})
