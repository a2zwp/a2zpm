<?php
namespace WebApps\a2zpm;

use \WebApps\a2zpm\Projects;

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
        add_action( 'wp_ajax_a2zpm-create-project', [ $this, 'create_project' ], 10 );
        add_action( 'wp_ajax_a2zpm-get-all-projects', [ $this, 'get_project' ], 10 );
        add_action( 'wp_ajax_a2zpm-archive-projects', [ $this, 'archive_project' ], 10 );
        add_action( 'wp_ajax_a2zpm-delete-projects', [ $this, 'delete_project' ], 10 );
    }

    /**
     * Verify requested nonce
     *
     * @param  string  the nonce action name
     *
     * @return void
     */
    public function verify_nonce( $action, $nonce ) {
        if ( ! isset( $nonce ) || ! wp_verify_nonce( $nonce, $action ) ) {
            wp_send_json_error( __( 'Error: Nonce verification failed', A2ZPM_TEXTDOMAIN ) );
        }
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

        if ( ! empty( $_POST['exclude'] ) ) {
            $exclude = array_map( 'intval', explode( ',', $_POST['exclude'] ) );
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
                        'ID' => $customer->ID,
                        'user_email' => $customer->user_email,
                        'display_name' => $customer->display_name,
                        'avatar_url' => get_avatar_url( $customer->ID )
                    ];
                }
            }
        }

        $found_customers = apply_filters( 'a2zpm_json_search_found_customers', $found_customers );

        wp_send_json_success( $found_customers );
    }

    /**
     * When searching using the WP_User_Query, search names (user meta) too.
     *
     * @param  object $query
     *
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

    /**
    * Project create
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function create_project() {
        $this->verify_nonce( 'a2zpm_project_create', $_POST['nonce'] );

        $postdata = !empty( $_POST['formdata'] ) ? $_POST['formdata'] : [];

        if ( empty( $postdata ) ) {
            wp_send_json_error( __( 'No post data found', A2ZPM_TEXTDOMAIN ) );
        }

        $id       = !empty( $postdata['ID'] ) ? $postdata['ID'] : 0;
        $title    = !empty( $postdata['title'] ) ? $postdata['title'] : '';
        $content  = !empty( $postdata['content'] ) ? $postdata['content'] : '';
        $category = !empty( $postdata['category'] ) ? $postdata['category'] : '';
        $label    = !empty( $postdata['label'] ) ? $postdata['label'] : '';
        $users    = !empty( $postdata['users'] ) ? $postdata['users'] : [];

        $data = [
            'ID'           => $id,
            'post_title'   => $title,
            'post_content' => $content,
            'category'     => $category,
            'label'        => $label,
            'users'        => $users,

        ];

        $project = new Projects();

        $project_id = $project->create_project( $data );

        if ( is_wp_error( $project_id ) ) {
            wp_send_json_error( $project_id->get_error_messages() );
        }

        wp_send_json_success();
    }

    /**
    * Get all projects with pagination
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function get_project() {
        $this->verify_nonce( 'a2zpm_get_projects', $_POST['nonce'] );

        $project = new Projects();
        $projects = $project->get_projects();

        if ( is_wp_error( $projects ) ) {
            wp_send_json_error( $projects->get_error_messages() );
        }

        wp_send_json_success( $projects );
    }

    /**
    * Archive projects
    *
    * Technically project move to trash
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function archive_project() {
        $this->verify_nonce( 'a2zpm_archive_projects', $_POST['nonce'] );

        $id = !empty( $_POST['id'] ) ? (int)$_POST['id'] : '';

        $project = new Projects();
        $archive = $project->archive_projects( $id );

        if ( is_wp_error( $archive ) ) {
            wp_send_json_error( $archive->get_error_messages() );
        }

        wp_send_json_success( $id );
    }

    /**
    * Delete projects
    *
    * Remove post form db with associate metas
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function delete_project() {
        $this->verify_nonce( 'a2zpm_delete_projects', $_POST['nonce'] );

        $id = !empty( $_POST['id'] ) ? (int)$_POST['id'] : '';

        $project = new Projects();
        $deleted = $project->delete_projects( $id );

        if ( is_wp_error( $deleted ) ) {
            wp_send_json_error( $deleted->get_error_messages() );
        }

        wp_send_json_success( $id );
    }

}


