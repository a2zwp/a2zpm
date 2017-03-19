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