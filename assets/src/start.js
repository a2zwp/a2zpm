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

