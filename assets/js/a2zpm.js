;(function($, a2zpm ) {
    'use strict';



var globalMixins = {

    methods: {

        initSelectize: function() {
            $( '.a2zpm-selectize' ).selectize( {
                plugins: ['remove_button']
            });
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
            console.log( selected, options );

            selectize[0].selectize.setValue( selected );
        },

        resizeSidebar: function() {
            $(window).resize(function() {
                $('.sidebar-section').height( ( $(window).height() )+'px' );
                $('.sidebar-section .content').height( ( $(window).height() - ( 31 + 33 + 50 + 56 ) )+'px' );
            });

            $(window).trigger('resize');
        }
    }

}


var ProjectAllListing = {
    template: '#tmpl-a2zpm-project-all-listing',

    data: function() {
        return {
            isSlide: false,
            projects: []
        }
    },

    methods: {
        addNewProjectSidebar: function() {
            this.isSlide = !this.isSlide;
        }
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
