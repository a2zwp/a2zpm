var projectSidebar = {

    template: '#tmpl-a2zpm-project-sidebar',

    mixins: [ globalMixins ],

    data: function() {
        return {
            project: {
                title: '',
                content: '',
                category: '',
                label: '',
                users: []
            },
            user_selected : []
        }
    },

    methods: {

        initialize: function() {
            var self = this;

            self.resizeSidebar();

            console.log( 'Init call' );

            self.initSelectize();
            self.selectizeSearchUser( self.user_selected, self.project.users );
        },

        createProject: function() {
            var data = {
                action: 'a2zpm-create-project',
                formdata: this.project,
                nonce: a2zpm.nonce.project_create
            };

            a2zpmBlock( 'a2zpm-project-sidebar-section', '#fff' );

            this.postRequest( data, function(resp){
                Event.$emit( 'a2zpm-fetch-all-projects' );
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            }, function(resp) {
                a2zpmUnblock( 'a2zpm-project-sidebar-section' );
            } );
        },

        cancelCreateProject: function() {
            this.$emit( 'cancelSidebar', false );
        }
    },

    mounted: function() {
        this.initialize();
    },

    created: function() {
        var self = this;
        Event.$on( 'a2zpm-edit-project', function( project ) {
            console.log( 'Event fire' );
            console.log( Object.keys( project.category ).join(',') );
            self.project.title = project.title;
            self.project.content = project.description;
            self.project.category = Object.keys( project.category ).join(',');
            self.project.label = project.label;

            $( '.a2zpm-project-category-select' ).on('change', function () {
                self.project.category = $(this).val();
            });

            $( '.a2zpm-project-label-select' ).on('change', function () {
                self.project.label = $(this).val();
            });

            $( '.a2zpm-serach-user' ).on('change', function() {
                self.project.users = $(this).val();
            });
        });
    }
};

Vue.component( 'project-sidebar', projectSidebar );

