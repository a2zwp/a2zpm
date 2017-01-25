var projectSidebar = {
    template: '#tmpl-a2zpm-project-sidebar',

    mixins: [ globalMixins ],

    data: function() {
        return {
            project: {
                title: '',
                content: '',
                category: '',
                users: [ '12', '13'],
                user_selected : [
                    {
                        id: 12,
                        display_name: 'Sabbir',
                        user_email: 'Sabbir@wedevs.com'
                    },
                    {
                        id: 13,
                        display_name: 'Jenis',
                        user_email: 'jenis@wedevs.com'

                    }
                ]
            }
        }
    },

    methods: {

        initialize: function() {
            var self = this;

            self.resizeSidebar();
            self.initSelectize();
            self.selectizeSearchUser( self.project.user_selected, self.project.users );

            $( '.a2zpm-project-category-select' ).on('change', function () {
                self.project.category = $(this).val();
            });

            $( '.a2zpm-serach-user' ).on('change', function() {
                console.log( 'aise bal' );
                self.project.users = $(this).val();
            });

        }
    },

    mounted: function() {
        this.initialize();
    }
};

Vue.component( 'project-sidebar', projectSidebar );