var SigleProject = {

    template: '#tmpl-a2zpm-project-single',

    mixins: [ globalMixins ],

    data: function() {
        return {
            project: {},
            isReady: false
        }
    },

    methods: {
        fetchProject: function() {
            var self = this;
            var data = {
                id: this.$route.params.id,
                action: 'a2zpm-get-all-projects',
                nonce: a2zpm.nonce.get_projects
            };

            self.isReady = false;

            this.postRequest( data,
            function(resp) {
                self.project = resp.data;
                self.isReady = true;
            },
            function(resp) {
                alert( 'Something wrong' );
                self.isReady = true;
            });
        }
    },

    created: function() {
        this.fetchProject();
    }
}