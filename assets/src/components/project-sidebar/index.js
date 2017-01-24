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