var ProjectAdd = {
    template: '#tmpl-a2zpm-project-add-form',

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

            users: [],
            selectedUsers: {},
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

        cancelSidebar: function() {
            router.replace( { name: 'a2zpm_home' } );
            Event.$emit( 'a2zpm-project-isSlide', false );
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
                self.clearDataObject( self.project, 'project' );
                Event.$emit( 'a2zpm-fetch-all-projects');
            }, function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            } );
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
                console.log( 'Something wrong try later' );
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
    }
}