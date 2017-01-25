<?php
namespace WebApps\a2zpm;

/**
* Handle all form
*/
class Ajax {

    /**
     * Autometically loaded when class initiate
     *
     * @since 1.0.0
     */
    public function __construct() {
        add_action( 'wp_ajax_a2zpm-search-user', [ $this, 'search_user' ], 10 );
    }

    /**
    * Search user using term
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function search_user() {

        $term    = a2zpm_clean( stripslashes( $_POST['query'] ) );
        $exclude = array();

        if ( empty( $term ) ) {
            die();
        }

        if ( ! empty( $_GET['exclude'] ) ) {
            $exclude = array_map( 'intval', explode( ',', $_GET['exclude'] ) );
        }

        $found_customers = array();

        add_action( 'pre_user_query', array( __CLASS__, 'json_search_customer_name' ) );

        $customers_query = new \WP_User_Query( apply_filters( 'woocommerce_json_search_customers_query', array(
            'fields'         => 'all',
            'orderby'        => 'display_name',
            'search'         => '*' . $term . '*',
            'search_columns' => array( 'ID', 'user_login', 'user_email', 'user_nicename' )
        ) ) );

        remove_action( 'pre_user_query', array( __CLASS__, 'json_search_customer_name' ) );

        $customers = $customers_query->get_results();

        if ( ! empty( $customers ) ) {
            foreach ( $customers as $customer ) {
                if ( ! in_array( $customer->ID, $exclude ) ) {
                    $found_customers[$customer->ID] = [
                        'id' => $customer->ID,
                        'user_email' => $customer->user_email,
                        'display_name' => $customer->display_name,
                        'name' => $customer->display_name . ' (#' . $customer->ID . ' &ndash; ' . sanitize_email( $customer->user_email ) . ')'
                    ];
                }
            }
        }

        $found_customers = apply_filters( 'woocommerce_json_search_found_customers', $found_customers );

        wp_send_json_success( $found_customers );
    }

    /**
     * When searching using the WP_User_Query, search names (user meta) too.
     * @param  object $query
     * @return object
     */
    public static function json_search_customer_name( $query ) {
        global $wpdb;

        $term = a2zpm_clean( stripslashes( $_POST['query'] ) );
        if ( method_exists( $wpdb, 'esc_like' ) ) {
            $term = $wpdb->esc_like( $term );
        } else {
            $term = like_escape( $term );
        }

        $query->query_from  .= " INNER JOIN {$wpdb->usermeta} AS user_name ON {$wpdb->users}.ID = user_name.user_id AND ( user_name.meta_key = 'first_name' OR user_name.meta_key = 'last_name' ) ";
        $query->query_where .= $wpdb->prepare( " OR user_name.meta_value LIKE %s ", '%' . $term . '%' );
    }
}


