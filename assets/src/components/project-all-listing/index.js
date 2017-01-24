var ProjectAllListing = {
    template: '#tmpl-a2zpm-project-all-listing',

    data: function() {
        return {
            isSlide: false,
            projects: []
        }
    },

    methods: {
        addNewProjectSidebar: function() {
            this.isSlide = !this.isSlide;
        }
    }
}