;(function($) {
    'use strict';


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

    methods: {

        initSelectize: function() {
            console.log( 'Aise' );
            jQuery( '.a2zpm-seletize' ).selectize( {
                plugins: ['remove_button']
            });

            // $('.sidebar-section .content').scroll(function (event) {
            //     var y = $(this).scrollTop();

            //     if (y >= 60) {
            //         $('.sidebar-section .header').addClass('shadow');
            //         $('.sidebar-section .content').addClass('push-top');
            //     } else {
            //         $('.sidebar-section .header').removeClass('shadow');
            //         $('.sidebar-section .content').removeClass('push-top');
            //     }
            //   });
        }
    },

    mounted: function() {
        this.initSelectize();
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

var a2zpm = new Vue({
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


})(jQuery);
