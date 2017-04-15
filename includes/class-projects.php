<?php
namespace WebApps\a2zpm;

/**
* Project class
*
* @package WebApps|a2zpm
*/
class Projects {

    /**
     * The product (post) ID.
     *
     * @var int
     */
    public $id = 0;

    /**
     * $post Stores post data.
     *
     * @var $post WP_Post
     */
    public $post = null;

    /**
     * Set common private data
     *
     * @var array
     */
    private $data = [
        'id',
        'title',
        'content',
        'category',
        'label',
        'created_at',
        'users'
    ];

    /**
    * Autometically loaded when class initiate
    *
    * @since 1.0.0
    */
    public function __construct( $project = null ) {
        if ( is_numeric( $project ) ) {
            $this->id   = absint( $project );
            $this->post = get_post( $this->id );
        } elseif ( $project instanceof \WebApps\a2zpm\Projects ) {
            $this->id   = absint( $project->id );
            $this->post = $project->post;
        } elseif ( isset( $project->ID ) ) {
            $this->id   = absint( $project->ID );
            $this->post = $project;
        }
    }

    /**
    * Set post data
    *
    * @since 0.0.1
    *
    * @return void
    **/
    public function get_post_data() {
        return get_post( $this->id );
    }

    /**
    * Get projects
    *
    * @since 1.0.0
    *
    * @param array $args
    *
    * @return array
    **/
    public function get_projects( $args = [] ) {
        global $wpdb;

        $projects =[];

        $defaults = array(
            'ID'             => 0,
            'post_status'    => ['publish'],
            'order'          => 'DESC',
            'orderby'        => 'date',
            'posts_per_page' => 20,
            'offset'         => 0
        );

        $args = wp_parse_args( $args, $defaults );

        $args['post_type'] = 'a2zpm_project';

        add_filter( 'posts_fields', [ $this, 'select_users_clause' ] );
        add_filter( 'posts_join', [ $this, 'join_user_table' ] );
        add_filter( 'posts_groupby', [ $this, 'group_by_clause' ] );
        // add_filter( 'posts_where', array( $this, 'get_project_where_user' ), 10, 3 );

        $query = new \WP_Query( apply_filters( 'a2zpm_get_projects', $args ) );

        remove_filter( 'posts_fields', [ $this, 'select_users_clause' ] );
        remove_filter( 'posts_groupby', [ $this, 'group_by_clause' ] );
        remove_filter( 'posts_join', [ $this, 'join_user_table' ] );
        // remove_filter( 'posts_where', array( $this, 'get_project_where_user' ), 10, 3 );

        if ( $query->posts ) {

            foreach ( $query->posts as $key => $project ) {
                // error_log( print_r( $project, true ) );
                $projects[$key] = [
                    'ID'          => $project->ID,
                    'title'       => $project->post_title,
                    'content'     => $project->post_content,
                    'created_at'  => $project->post_date
                ];

                // Mapping project categories ( @TODO: If Needs, then change as multiple category );
                $category = wp_get_post_terms( $project->ID, 'a2zpm_project_category' );
                $map_category = [];
                if ( ! empty( $category ) ) {
                    $map_category = array_map( function( $item ) {
                        return [
                            'id' => $item->term_id,
                            'name' => $item->name
                        ];
                    }, $category );
                }
                $projects[$key]['category'] = reset( $map_category );

                // Mapping project labels
                $label = get_post_meta( $project->ID, '_a2zpm_project_label', true );
                $map_label = [];
                if ( ! empty( $label ) ) {
                    $label_data = a2zpm_get_project_label( $label );
                    $map_label =  [
                        'id' => $label,
                        'name' => !empty( $label_data['label'] ) ? $label_data['label'] : ''
                    ];
                }
                $projects[$key]['label'] = $map_label;

                $projects[$key]['users'] = [];

                if ( ! empty( $project->user_id ) ) {
                    $users = explode( ',', $project->user_id );

                    $projects[$key]['users'] = array_map( function( $user ) {
                        $user_data  = \get_user_by( 'id', $user );
                        $first_name = !empty( $user_data->first_name ) ? $user_data->first_name : $user_data->display_name;
                        $last_name  = !empty( $user_data->last_name ) ? $user_data->last_name : '';
                        $full_name  = ( $first_name || $last_name ) ? $first_name . ' ' . $last_name : $user_data->display_name;
                        $avatar_url = get_avatar_url( $user_data->ID );

                        return [
                            'id'         => $user_data->ID,
                            'first_name' => $first_name,
                            'last_name'  => $last_name,
                            'full_name'  => trim( $full_name ),
                            'avatar_url' => $avatar_url
                        ];

                    }, $users );
                }

            }
        }

        return $projects;
    }

    /**
    * Get a project using by fields
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function get_project( $field, $value ) {
        global $wpdb;

        if ( empty( $field ) ) {
            return new \WP_Error( 'no-field', __( 'No field provided', A2ZPM_TEXTDOMAIN ) );
        }


        if ( empty( $value ) ) {
            return new \WP_Error( 'no-value', __( 'No value provided', A2ZPM_TEXTDOMAIN ) );
        }

        $cache_key = 'a2zpm-project-by-' . md5( serialize( $value ) );
        $project   = wp_cache_get( $cache_key, 'a2zpm' );
        $projects  = [];

        if ( false === $project ) {
            $args = [
                'post_type' => 'a2zpm_project',
            ];

            // Check if field is ID or id
            // @TODO: Need to check others fields for fetching projects
            if ( 'id' === strtolower( $field ) ) {
                if ( is_array( $value ) ) {
                    $args['post__in'] = (array)$value;
                } else {
                    $args['p'] = intval( $value );
                }
            }

            add_filter( 'posts_fields', [ $this, 'select_users_clause' ] );
            add_filter( 'posts_join', [ $this, 'join_user_table' ] );
            add_filter( 'posts_groupby', [ $this, 'group_by_clause' ] );
            // add_filter( 'posts_where', array( $this, 'get_project_where_user' ), 10, 3 );

            $query = new \WP_Query( apply_filters( 'a2zpm_get_project_by', $args ) );

            remove_filter( 'posts_fields', [ $this, 'select_users_clause' ] );
            remove_filter( 'posts_groupby', [ $this, 'group_by_clause' ] );
            remove_filter( 'posts_join', [ $this, 'join_user_table' ] );

            if ( $query->posts ) {
                foreach ( $query->posts as $key => $project ) {
                    $projects[$key] = [
                        'ID'          => $project->ID,
                        'title'       => $project->post_title,
                        'content'     => $project->post_content,
                        'created_at'  => $project->post_date
                    ];

                    // Mapping project categories ( @TODO: If Needs, then change as multiple category );
                    $category = wp_get_post_terms( $project->ID, 'a2zpm_project_category' );
                    $map_category = [];
                    if ( ! empty( $category ) ) {
                        $map_category = array_map( function( $item ) {
                            return [
                                'id' => $item->term_id,
                                'name' => $item->name
                            ];
                        }, $category );
                    }
                    $projects[$key]['category'] = reset( $map_category );

                    // Mapping project labels
                    $label = get_post_meta( $project->ID, '_a2zpm_project_label', true );
                    $map_label = [];
                    if ( ! empty( $label ) ) {
                        $label_data = a2zpm_get_project_label( $label );
                        $map_label =  [
                            'id' => $label,
                            'name' => !empty( $label_data['label'] ) ? $label_data['label'] : ''
                        ];
                    }
                    $projects[$key]['label'] = $map_label;

                    $users = [];
                    $projects[$key]['users'] = [];

                    if ( ! empty( $project->user_id ) ) {
                        $users = explode( ',', $project->user_id );
                    }

                    if ( !empty( $users ) ) {
                        $projects[$key]['users'] = array_map( function( $user ) {
                            $user_data  = \get_user_by( 'id', $user );
                            $first_name = !empty( $user_data->first_name ) ? $user_data->first_name : $user_data->display_name;
                            $last_name  = !empty( $user_data->last_name ) ? $user_data->last_name : '';
                            $full_name  = ( $first_name || $last_name ) ? $first_name . ' ' . $last_name : $user_data->display_name;
                            $avatar_url = get_avatar_url( $user_data->ID );

                            return [
                                'ID'           => $user_data->ID,
                                'first_name'   => $first_name,
                                'last_name'    => $last_name,
                                'full_name'    => trim( $full_name ),
                                'user_email'   => $user_data->user_email,
                                'display_name' => $user_data->display_name,
                                'avatar_url'   => $avatar_url
                            ];

                        }, $users );
                    }

                }
            }

            if ( count( $projects ) === 1 ) {
                $projects = reset( $projects );
            }

            wp_cache_set( $cache_key, $projects, 'a2zpm' );
        }

        return $projects;
    }

    /**
    * Create a project
    *
    * @since 1.0.0
    *
    * @param array $args
    *
    * @return integer
    **/
    public function create_project( $args = [] ) {

        $defaults = [
            'ID'           => 0,
            'post_author'  => get_current_user_id(),
            'post_title'   => '',
            'post_excerpt' => '',
            'post_status'  => 'publish',
            'category'     => '',
            'users'        => []
        ];

        $args = wp_parse_args( $args, $defaults );

        $args['post_type'] = 'a2zpm_project';

        if ( empty( $args['post_title'] ) ) {
            return new \WP_Error( 'no-title', __( 'Project title must be required', A2ZPM_TEXTDOMAIN ) );
        }

        if ( empty( $args['ID'] ) ) {
            $this->id = wp_insert_post( $args );
        } else {
            $this->id = wp_update_post( $args );
        }

        if ( is_wp_error( $this->id ) ) {
            return $this->id;
        }

        if ( ! empty( $args['category']['id'] ) ) {
            wp_set_post_terms( $this->id, (array)$args['category']['id'], 'a2zpm_project_category', false );
        }

        if ( ! empty( $args['label']['id'] ) ) {
            update_post_meta( $this->id, '_a2zpm_project_label', sanitize_text_field( $args['label']['id'] ) );
        }

        if ( empty( $args['ID'] ) ) {
            $this->project_assign_user( $args['users'] );
        }

        do_action( 'a2zpm_create_projects', $this->id, $args );

        return $this->id;
    }

    /**
    * Archive project
    *
    * @since 1.0.0
    *
    * @param integer $id
    *
    * @return void
    **/
    public function archive_projects() {
        if ( empty( $this->id ) ) {
            return new \WP_Error( 'no-project-id', __( 'No project found for archiving', A2ZPM_TEXTDOMAIN ) );
        }

        $is_archive = wp_trash_post( $this->id );

        if ( ! $is_archive ) {
            return new \WP_Error( 'no-project-id', __( 'Project are not successfully archived', A2ZPM_TEXTDOMAIN ) );
        }

        return $is_archive;
    }

    /**
    * Delete project
    *
    * @since 1.0.0
    *
    * @param integer $id
    *
    * @return void
    **/
    public function delete_projects() {
        if ( empty( $this->id ) ) {
            return new \WP_Error( 'no-project-id', __( 'No project found for deleting', A2ZPM_TEXTDOMAIN ) );
        }

        $is_deleted = wp_delete_post( $this->id, true );

        if ( $is_deleted ) {
            $this->delete_assign_user( $this->id );
        }

        if ( ! $is_deleted ) {
            return new \WP_Error( 'no-project-id', __( 'Project are not successfully deleted', A2ZPM_TEXTDOMAIN ) );
        }

        return $is_deleted;
    }

    /**
    * Project assign users
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function project_assign_user( $users ) {
        global $wpdb;

        if ( ! $this->id ) {
            return;
        }

        $values       = [];
        $assign_users = [];
        $table_name   = $wpdb->prefix . 'a2zpm_users';

        if ( ! empty( $users ) ) {
            $assign_users = wp_list_pluck( $users, 'ID' );
            $assign_users = array_map( 'intval', $assign_users );
        }

        $project_author = get_post_field( 'post_author', $this->id );

        // If already post author not inside this array then kick in ass this post author and insert to this array
        if ( ! in_array( $project_author, $assign_users ) ) {
            $assign_users[] = intval( $project_author );
        }

        if ( empty( $assign_users ) ) {
            return;
        }

        // Delete all user row associated with project id
        $wpdb->delete( $table_name, array( 'project_id' => $this->id ), array( '%d' ) );

        // Now time to insert all updated assignable user
        $query = "INSERT INTO $table_name ( project_id, user_id ) VALUES ";

        foreach( $assign_users as $key => $user ) {
             array_push( $values, $this->id, $user );
             $place_holders[] = "('%d', '%d')";
        }

        $query .= implode( ', ', $place_holders );
        $wpdb->query( $wpdb->prepare( "$query ", $values ) );

        return true;
    }

    /**
    * Delete assign project user
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function delete_assign_user() {
        global $wpdb;

        if ( ! $this->id ) {
            return;
        }

        $table = $wpdb->prefix . 'a2zpm_users';
        $result = $wpdb->delete( $table, array( 'project_id' => $this->id ) );

        if ( ! $result ) {
            return new \WP_Error( 'no-project-id', __( 'Something wrong to delete assignable users', A2ZPM_TEXTDOMAIN ) );
        }

        return $result;
    }

    /**
    * name
    *
    * @since 0.0.1
    *
    * @return void
    **/
    public function select_users_clause( $select ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'a2zpm_users';

        $select .= ", GROUP_CONCAT( DISTINCT {$table_name}.user_id SEPARATOR ',') AS user_id ";

        return $select;
    }

    /**
    * name
    *
    * @since 0.0.1
    *
    * @return void
    **/
    function join_user_table( $join ) {
        global $wp_query, $wpdb;

        $table = $wpdb->prefix . 'a2zpm_users';
        $join .= "LEFT JOIN $table ON $wpdb->posts.ID = {$table}.project_id";

        return $join;
    }

    function group_by_clause( $groupby ) {
        global $wpdb;
        $groupby = "{$wpdb->posts}.ID";
        return $groupby;
    }

    // function get_project_where_user( $where, &$wp_query, $user_id = 0 ) {
    //     global $wp_query, $wpdb;

    //     $table = $wpdb->prefix . 'a2zpm_users';

    //     if ( absint( $user_id ) ) {
    //         $user_id = $user_id;
    //     } else {
    //         $user_id = get_current_user_id();
    //     }

    //     $project_where = " AND $table.user_id = $user_id";
    //     $where .= apply_filters( 'cpm_get_projects_where', $project_where, $table, $where, $wp_query, $user_id );
    //     return $where;
    // }

}













