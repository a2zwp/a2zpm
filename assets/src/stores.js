var store = new Vuex.Store({
    state: {
        projects:[]
    },

    mutations: {
        setAllProjects: function ( state, projects ) {
            state.projects = projects;
        }
    }
});