var ProjectAllListing = {

    template: '#tmpl-a2zpm-project-all-listing',

    mixins: [ globalMixins ],

    data: function() {
        return {
            isSlide: false,
            projects: [],
            project: {
                ID: 0,
                title: '',
                content: '',
                category: '',
                label: '',
                users: []
            },
            selected: {
                category: {},
                label: {}
            },
            selectedUsers: {},
            users: [],
            isLoading: false
        }
    },

    computed: {

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

    methods: {
        toggleProjectSidebar: function() {
            this.isSlide = !this.isSlide;
        },

        cancelCreateProject: function() {
            this.isSlide = false;
        },

        createAt: function(date) {
            return moment( date ).fromNow();
        },

        fetchProjects: function() {
            var self = this;
            var data = {
                action: 'a2zpm-get-all-projects',
                nonce: a2zpm.nonce.get_projects
            };

            a2zpmBlock( 'a2zpm-project-list', '#f1f1f1' );

            this.postRequest( data,
            function(resp) {
                self.projects = resp.data;
                a2zpmUnblock( 'a2zpm-project-list' );
                self.isSlide = false;
            },
            function(resp) {
                alert('Something wrong');
                a2zpmUnblock( 'a2zpm-project-list' );
            });
        },

        createProject: function() {
            var self = this,
                data = {
                    action: 'a2zpm-create-project',
                    formdata: this.project,
                    nonce: a2zpm.nonce.project_create
                };

            a2zpmBlock( 'a2zpm-project-sidebar-section', '#fff' );

            this.postRequest( data, function(resp){
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
                self.fetchProjects();
            }, function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            } );
        },

        editProject: function( projectData ) {
            this.isSlide = true;
            this.setDataObject( projectData, 'project' );
        },

        archiveProject: function( index, project ) {
            var self = this,
                data = {
                    action: 'a2zpm-archive-projects',
                    id: project.ID,
                    nonce: a2zpm.nonce.project_archive
                };

            a2zpmConfirm( a2zpm.i18n_js.confirm, function( resp ) {
                if ( resp ) {
                    a2zpmBlock( 'a2zpm-project-list', '#f1f1f1' );

                    self.postRequest( data, function(resp){
                        a2zpmUnblock( 'a2zpm-project-list' );
                        self.projects.splice( index, 1 );
                    }, function(resp) {
                        a2zpmUnblock( 'a2zpm-project-list' );
                    } );
                }
            } );

        },

        deleteProject: function( index, project ) {
            var self = this,
                data = {
                    action: 'a2zpm-delete-projects',
                    id: project.ID,
                    nonce: a2zpm.nonce.project_delete
                };

            a2zpmConfirm( a2zpm.i18n_js.confirm, function( resp ) {
                if ( resp ) {
                    a2zpmBlock( 'a2zpm-project-list', '#f1f1f1' );

                    self.postRequest( data, function(resp){
                        a2zpmUnblock( 'a2zpm-project-list' );
                        self.projects.splice( index, 1 );
                    }, function(resp) {
                        a2zpmUnblock( 'a2zpm-project-list' );
                    } );
                }
            } );
        },

        limitText (count) {
            return `and ${count} other countries`
        },

        asyncFind (query) {
            if ( query.length < 2 ) {
                return;
            }

            var self = this;
            self.isLoading = true;
            var data = {
                action : 'a2zpm-search-user',
                exclude: a2zpm.current_user.ID,
                query : query
            };

            self.postRequest( data, function(resp) {
                self.isLoading = false;
                self.users = _.map( resp.data, function( el ) { return el } );
            }, function(resp) {
                console.log( 'Something wrong try later' );
            } );
        }
    },

    watch: {
        // call again the method if the route changes
        // '$route': 'fetchProjects',

        'isSlide': function( value ) {
            if ( ! value ) {
                this.clearDataObject( this.project, 'project' );
            }
        }
    },

    mounted: function() {
        this.resizeSidebar();
    },

    created: function() {
        var self = this;

        self.fetchProjects();

        Event.$on( 'a2zpm-fetch-all-projects', function() {
            self.fetchProjects();
        } );
    }
}