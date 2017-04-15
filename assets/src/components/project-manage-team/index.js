var ProjectManageTeam = {
    template: '#tmpl-a2zpm-project-manage-team',

    mixins: [ globalMixins ],

    data: function() {
        return {
            project: {},
            users: [],
            selectedUsers: {},
            isLoading: false
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

        updateTeam: function() {
            var self = this;
            var data = {
                id: self.$route.params.id,
                users: self.project.users,
                action: 'a2zpm-update-project-team',
                nonce: a2zpm.nonce.update_team
            };

            a2zpmBlock( 'a2zpm-project-sidebar-section', '#fff' );

            this.postRequest( data,
            function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
                Event.$emit( 'a2zpm-fetch-all-projects');
            },
            function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
                alert( 'Something wrong' );
            });
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
                self.project = resp.data;
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            },
            function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
                alert( 'Something wrong' );
            });
        },

        asyncFind (query) {
            if ( query.length < 2 ) {
                return;
            }

            var self = this,
                userArray = _.pluck( self.project.users, 'ID' );

            if ( ! _.contains( userArray, a2zpm.current_user.ID.toString() ) ) {
                 userArray.push( a2zpm.current_user.ID.toString() );
            }

            self.isLoading = true;
            var data = {
                action : 'a2zpm-search-user',
                exclude: userArray,
                query : query
            };

            self.postRequest( data, function(resp) {
                self.isLoading = false;
                self.users = _.map( resp.data, function( el ) { return el } );
            }, function(resp) {
                console.log( 'Something wrong try later' ); // @TODO: neen to localize later
            } );
        },

        setProjectUser: function( selectedOption, id ) {
            if ( ! _.contains( _.pluck( this.project.users, 'ID' ), selectedOption.ID ) ) {
                this.project.users.push( selectedOption );
            }
        },

        removeSelectedUser: function( value, id ) {
            var self = this;

            self.users = self.users.filter( function( value ) {
                if ( ! _.contains( _.pluck( self.project.users, 'ID' ), value.ID ) ) {
                    return value;
                }
            });
        },

        removeProjectUser: function( index ) {
            this.project.users.splice( index, 1 );
        }
    },

    mounted: function() {
        this.resizeSidebar();
        this.fetchProject();
    }

};