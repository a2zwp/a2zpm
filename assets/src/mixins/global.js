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
                $('.sidebar-section .content').height( ( $(window).height() - ( 31 + 40 + 50 + 30 ) )+'px' );
            });

            $(window).trigger('resize');
        }
    }

}

