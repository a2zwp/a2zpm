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

