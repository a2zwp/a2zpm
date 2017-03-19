var projects = new Vue({
    el: '#a2zpm-projects',

    store: store,

    router: router,

    data: {
        isSlide: false,
    },

    methods: {

        addNewProject: function() {
            this.isSlide = !this.isSlide;
        }
    }
});

