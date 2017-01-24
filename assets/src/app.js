var a2zpm = new Vue({
    el: '#a2zpm-projects',

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

