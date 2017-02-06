;(function($, a2zpm ) {
    'use strict';

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

Vue.component('Multiselect', VueMultiselect.default);

Vue.directive('tooltip', {
  bind: function( el, binding, vnode ) {
    $(el).tooltip('show');
  },
  unbind: function( el, binding, vnode ) {
    $(el).tooltip('destroy');
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

    ready: function()  {
        $('.a2zpm-tooltip').tooltip();
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


// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  // { path: '/foo', component: Projects },
  // { path: '/bar', component: Bar },
  { path: '/*', component: ProjectAllListing }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes:routes // short for routes: routes
})

var projects = new Vue({
    el: '#a2zpm-projects',

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
