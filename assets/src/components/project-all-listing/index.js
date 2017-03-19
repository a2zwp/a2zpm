var ProjectAllListing = {

    template: '#tmpl-a2zpm-project-all-listing',

    mixins: [ globalMixins ],

    data: function() {
        return {
            isSlide: false,
            isManageTeam: false,
            // projects: [],
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

        projects: function() {
            return this.$store.state.projects;
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
        },

        isEditProject: function() {
            return ( this.project.ID != 0 );
        }

    },

    methods: {
        toggleProjectSidebar: function() {
            this.isSlide = !this.isSlide;
        },

        cancelSidebar: function() {
            this.isSlide = false;
            this.isManageTeam = false;
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
                // self.projects = resp.data;
                self.$store.state.projects = resp.data;
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

        manageTeam: function( project ) {
            this.isSlide = true;
            this.isManageTeam = true;
        },

        saveTeam: function() {

        },

        pushProjectUser: function( value, id ) {

        },

        selectizeSearchUser: function( options, selected ) {

            var emailRgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            var selectize = $('.a2zpm-serach-user').selectize({
                persist: false,
                valueField: 'id',
                options: options,
                labelField: 'display_name',
                searchField: ['display_name'],
                plugins: ['remove_button'],
                render: {
                    option: function( item, escape ) {
                        return '<div>' + item.display_name+ '( ' + item.user_email + ' )' + '</div>';
                    }
                },
                createFilter: function(input) {
                    var match;
                    match = input.match( emailRgx );
                    if (match) {
                        return !this.options.hasOwnProperty( match[0] );
                    }
                    return false;
                },
                create: function(input) {
                    if ( emailRgx.test( input ) ) {
                        return { id: input, display_name: input };
                    }

                    return false;
                },

                load: function(query, callback) {
                    if (!query.length) return callback();

                    var data = {
                        action : 'a2zpm-search-user',
                        query: encodeURIComponent(query)
                    }

                    $.post( a2zpm.ajaxurl, data, function( resp ) {

                        if ( resp.success ) {
                            var result = $.map( resp.data, function( value, index ) {
                                return [value];
                            });

                            callback( result );
                        } else {
                            callback();
                        }
                    });
                }
            });
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

    ready: function()  {
        $('.a2zpm-tooltip').tooltip();
    },

    mounted: function() {
        this.selectizeSearchUser();
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