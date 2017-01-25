<?php

/**
 * Get all js template
 *
 * @since  1.0.0
 *
 * @param  string $file_path [description]
 * @param  string $id        [description]
 *
 * @return void
 */
function a2zpm_get_js_template( $file_path, $id ) {
    if ( file_exists( $file_path ) ) {
        echo '<script type="text/x-template" id="tmpl-' . $id . '">' . "\n";
        include_once $file_path;
        echo "\n" . '</script>' . "\n";
    }
}

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 *
 * @param string|array $var
 *
 * @return string|array
 */
function a2zpm_clean( $var ) {
    if ( is_array( $var ) ) {
        return array_map( 'wc_clean', $var );
    } else {
        return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
    }
}

