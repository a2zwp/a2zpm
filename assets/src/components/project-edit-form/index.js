var ProjectEdit = {
    template: '#tmpl-a2zpm-project-edit-form',

    mixins: [ globalMixins ],

    data: function() {
        return {
            project: {
                ID: 0,
                title: '',
                content: '',
                category: '',
                label: '',
                users: []
            },
        }
    },

    computed: {

        projectTitleHeading: function() {
            return this.project.title || 'Edit this project'; // @TODO: Need to localize it
        },

        categoryOptions: function() {
            return _.map( a2zpm.project_categories, function( value ) {
                return {
                    id : value.term_id,
                    name: value.name
                };
            } );
        },

        lableOptions: function() {
            return _.map( a2zpm.project_label, function( value, key ) {
                return {
                    id : key,
                    name: value.label
                };
            } );
        }

    },

    watch: {
        '$route': 'fetchProject'
    },

    methods: {

        cancelSidebar: function() {
            router.replace( { name: 'a2zpm_home' } );
            Event.$emit( 'a2zpm-project-isSlide', false );
        },

        fetchProject: function() {
            var self = this;
            var data = {
                id: this.$route.params.id,
                action: 'a2zpm-get-all-projects',
                nonce: a2zpm.nonce.get_projects
            };

            a2zpmBlock( 'a2zpm-project-sidebar-section', '#fff' );

            this.postRequest( data,
            function(resp) {
                self.setDataObject( resp.data, 'project' );
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            },
            function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
                alert( 'Something wrong' );
            });
        },

        updateProject: function() {
            var self = this,
                data = {
                    action: 'a2zpm-create-project',
                    formdata: this.project,
                    nonce: a2zpm.nonce.project_create
                };

            a2zpmBlock( 'a2zpm-project-sidebar-section', '#fff' );

            this.postRequest( data, function(resp){
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
                Event.$emit( 'a2zpm-fetch-all-projects');
                router.replace( { name: 'a2zpm_home' } );
                Event.$emit( 'a2zpm-project-isSlide', false );
            }, function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            } );
        },

        editProject: function() {
            this.setDataObject( this.projectData, 'project' );
        }
    },

    mounted: function() {
        this.resizeSidebar();
        this.fetchProject();
    }

}