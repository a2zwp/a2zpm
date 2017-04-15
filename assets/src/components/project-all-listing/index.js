var ProjectAllListing = {

    template: '#tmpl-a2zpm-project-all-listing',

    mixins: [ globalMixins ],

    data: function() {
        return {
            isLoading: false,
            isSlide: false,
            a2zpm: a2zpm
        }
    },

    computed: {
        projects: function() {
            return this.$store.state.projects;
        }
    },

    methods: {

        createAt: function(date) {
            return moment( date ).fromNow();
        },

        showProjectLabel: function( label ) {
            if ( typeof label.id == 'undefined' ) {
                return '';
            }

            return 'label-' + a2zpm.project_label[label.id].class;
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
                self.$store.state.projects = resp.data;
                a2zpmUnblock( 'a2zpm-project-list' );
            },
            function(resp) {
                alert('Something wrong');
                a2zpmUnblock( 'a2zpm-project-list' );
            });
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

    created: function() {
        var self = this;

        // Set slide constant true/false depending on routing( if sidebar is present or not )
        if ( 'a2zpm_project_add' == this.$route.name || 'a2zpm_project_edit' == this.$route.name || 'a2zpm_project_manage_team' == this.$route.name ) {
            self.isSlide = true;
        }

        self.fetchProjects();

        Event.$on( 'a2zpm-fetch-all-projects', function() {
            self.fetchProjects();
        } );

        Event.$on( 'a2zpm-project-isSlide', function( $isSlide ) {
            self.isSlide = $isSlide;
        } );
    }
}