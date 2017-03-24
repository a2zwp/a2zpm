;(function($, a2zpm ) {
    'use strict';

    Vue.config.devtools = true;


    window.Event = new Vue();

    window.a2zpmBlock = function( id, bgcolor ) {
        $('#' + id ).block({
            message: '<span class="a2zpm-loader"></span>',
            blockMsgClass: 'a2zpm-block-msg',
            overlayCSS: {
                background: bgcolor,
                opacity: 0.6
            },
        });
    };

    window.a2zpmUnblock = function( id ) {
        $('#' + id ).unblock();
    };

    window.a2zpmConfirm = function( message, callback ) {
        bootbox.confirm({
            message: message,
            onEscape: false,
            closeButton: false,
            buttons: {
                confirm: {
                    label: a2zpm.i18n_js.yes,
                    className: 'button-primary'
                },
                cancel: {
                    label: a2zpm.i18n_js.no,
                    className: 'button'
                }
            },
            callback: function (result) {
                callback( result );
            }
        });
    }

    // Vue multiselect component
    Vue.component('Multiselect', VueMultiselect.default);

    // Tooltip directive
    Vue.directive('tooltip', {
        bind: function( el, binding, vnode ) {
            $(el).tooltip('show');
        },
        unbind: function( el, binding, vnode ) {
            $(el).tooltip('destroy');
        }
    });


var store = new Vuex.Store({
    state: {
        projects:[]
    },

    mutations: {
        setAllProjects: function ( state, projects ) {
            state.projects = projects;
        }
    }
});
var globalMixins = {

    methods: {

        postRequest: function( data, callbackSucess, callbackError ) {
            $.post( a2zpm.ajaxurl, data, function( resp ) {
                if ( resp.success ) {
                    callbackSucess(resp);
                } else {
                    callbackError(resp);
                }
            } );
        },

        clearDataObject: function( data, key ) {
            for( var i in data ) {
                if ( _.isArray( data[i] ) ) {
                    this.$data[key][i] = [];
                } else if ( _.isObject( data[i] ) ) {
                    this.$data[key][i] = null;
                } else {
                    this.$data[key][i] = '';
                }
            }
        },

        setDataObject: function( data, key ) {
            for( var i in this.$data[key] ) {
                this.$data[key][i] = data[i];
            }
        },

        resizeSidebar: function() {
            $(window).resize(function() {
                $('.sidebar-section').height( ( $(window).height() )+'px' );
                $('.sidebar-section .content').height( ( $(window).height() - ( 31 + 33 + 50 + 28 ) )+'px' );
            });

            $(window).trigger('resize');
        }
    }

}


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
        }
    },

    mounted: function() {
        this.resizeSidebar();
    }
}
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
        if ( 'a2zpm_project_add' == this.$route.name || 'a2zpm_project_edit' == this.$route.name  ) {
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
var ProjectFiles = {
    template: '#tmpl-a2zpm-project-files',

    created: function() {

    }
}
var ProjectTasklists = {

    template: '#tmpl-a2zpm-project-listtask',

    mounted : function() {
        $(window).resize(function() {
            $('.project-nav-content').height( ( $(window).height() - 210 ) +'px' );
            $('.project-nav-content').find('ul.task-list-item').height( $('.project-nav-content').height() - (30+35+10+10) );
        });

        $(window).trigger('resize');

    }
}
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


var SingleTask = {

    template: '#tmpl-a2zpm-project-single-task',

    mounted : function() {
        console.log( 'Loaded' );
    }
}
var SingleTaskList = {

    template: '#tmpl-a2zpm-project-single-tasklist',

    mounted : function() {
        console.log( this.$route );
    }
}
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
var SingleInboxTasklist = {

    template: '#tmpl-a2zpm-single-inbox-tasklist',

    mounted : function() {
    }
}
// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
var routes = [
    { path: '/projects', component: ProjectAllListing, name: 'a2zpm_all_project',
        children: [
            { path: 'add', component: ProjectAdd, name: 'a2zpm_project_add' },
            { path: 'edit/:id', component: ProjectEdit, name: 'a2zpm_project_edit' },
        ]

    },


    {
        path: '/project/:id', name: 'singleproject', component: SigleProject,
        children : [
            {
                path: 'tasklists',
                component: ProjectTasklists,
                children : [
                    {
                        path: 'inbox',
                        component: SingleInboxTasklist
                    },
                    {
                        path: 'my-task',
                        component: SingleTaskList
                    },

                    {
                        path: 'pinned',
                        component: SingleTaskList
                    },

                    {
                        path: ':listID',
                        component: SingleTaskList
                    },

                    {
                        path: 'tasks/:taskID',
                        component: SingleTask
                    },

                ]
            },
            {
                path: 'files',
                component: ProjectFiles
            }

        ]
    },
    { path: '/', component: ProjectAllListing, name: 'a2zpm_home' }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter({
    routes:routes // short for routes: routes
})

var projects = new Vue({
    el: '#a2zpm-projects',

    store: store,

    router: router,

    data: {
        isSlide: false,
    },

    methods: {

        addNewProject: function() {
            this.isSlide = !this.isSlide;
        }
    }
});


})(jQuery, a2zpm );
