<?php
namespace WebApps\a2zpm;

/**
* Menu handling for Admin
*
* @since 1.0.0
*/
class Post_Types {

    /**
     * Autometically loaded when class initiate
     *
     * @since 1.0.0
     */
    public function __construct() {
        add_action( 'init', [ $this, 'init_post_types' ], 10 );
        add_filter( 'manage_edit-project_category_columns', array( $this, 'manage_edit_project_category_columns' ) );
        add_filter( 'parent_file', array( $this, 'set_category_menu' ) );
    }

    /**
     * Modifies columns in project category table.
     *
     * @since 1.0.0
     *
     * @return array
     */
    public function manage_edit_project_category_columns( $columns ) {
        unset( $columns['posts'] );
        return $columns;
    }

    /**
     * Set category menu in main project page
     *
     * @since 1.0.0
     *
     * @param string $parent_file
     */
    public function set_category_menu( $parent_file ) {
        global $current_screen;

        if ( $current_screen->taxonomy == 'a2zpm_project_category' ) {
            $parent_file = 'a2zpm-project';
        }

        return $parent_file;
    }

    /**
    * Register all post_types and taxonomies
    *
    * @since 1.0.0
    *
    * @return void
    **/
    public function init_post_types() {

        $labels = apply_filters( 'a2zpm_project_post_type_labels', [
            'name'                  => __( 'Project', A2ZPM_TEXTDOMAIN ),
            'singular_name'         => __( 'Project', A2ZPM_TEXTDOMAIN ),
            'menu_name'             => __( 'Projects', A2ZPM_TEXTDOMAIN ),
            'add_new'               => __( 'Add Project', A2ZPM_TEXTDOMAIN ),
            'add_new_item'          => __( 'Add New Project', A2ZPM_TEXTDOMAIN ),
            'edit'                  => __( 'Edit', A2ZPM_TEXTDOMAIN ),
            'edit_item'             => __( 'Edit Project', A2ZPM_TEXTDOMAIN ),
            'new_item'              => __( 'New Project', A2ZPM_TEXTDOMAIN ),
            'view'                  => __( 'View Project', A2ZPM_TEXTDOMAIN ),
            'view_item'             => __( 'View Project', A2ZPM_TEXTDOMAIN ),
            'search_items'          => __( 'Search Project', A2ZPM_TEXTDOMAIN ),
            'not_found'             => __( 'No Project Found', A2ZPM_TEXTDOMAIN ),
            'not_found_in_trash'    => __( 'No Project found in trash', A2ZPM_TEXTDOMAIN ),
            'parent'                => __( 'Parent Project', A2ZPM_TEXTDOMAIN ),
            'featured_image'        => __( 'Project Logo', A2ZPM_TEXTDOMAIN ),
            'set_featured_image'    => __( 'Set Project logo', A2ZPM_TEXTDOMAIN ),
            'remove_featured_image' => __( 'Remove Project logo', A2ZPM_TEXTDOMAIN ),
            'use_featured_image'    => __( 'Use as Project logo', A2ZPM_TEXTDOMAIN ),
        ] );

        $category_labels = apply_filters( 'a2zpm_project_category_labels', [
            'name'              => _x( 'Project Categories', 'Project general name' ),
            'singular_name'     => _x( 'Project', 'Project singular name' ),
            'search_items'      => __( 'Search Project Categories', A2ZPM_TEXTDOMAIN ),
            'all_items'         => __( 'All Project Categories', A2ZPM_TEXTDOMAIN ),
            'parent_item'       => __( 'Parent Project Category', A2ZPM_TEXTDOMAIN ),
            'parent_item_colon' => __( 'Parent Project Category:', A2ZPM_TEXTDOMAIN ),
            'edit_item'         => __( 'Edit Project Category', A2ZPM_TEXTDOMAIN ),
            'update_item'       => __( 'Update Project Category', A2ZPM_TEXTDOMAIN ),
            'add_new_item'      => __( 'Add New Project Category', A2ZPM_TEXTDOMAIN ),
            'new_item_name'     => __( 'New Project Category Name', A2ZPM_TEXTDOMAIN ),
            'menu_name'         => __( 'Project Categories', A2ZPM_TEXTDOMAIN ),
        ] );

        register_post_type( 'a2zpm_project', [
            'label'               => __( 'Project', A2ZPM_TEXTDOMAIN ),
            'description'         => __( 'project manager post type', A2ZPM_TEXTDOMAIN ),
            'public'              => false,
            'show_in_admin_bar'   => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => false,
            'show_in_admin_bar'   => false,
            'show_ui'             => false,
            'show_in_menu'        => false,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'rewrite'             => [ 'slug' => '' ],
            'query_var'           => true,
            'supports'            => [ 'title', 'editor', 'comments' ],
            'show_in_json'        => true,
            'labels'              => $labels
        ] );

        register_taxonomy( 'a2zpm_project_category', 'a2zpm_project', [
            'hierarchical' => true,
            'labels'       => $category_labels,
            'rewrite'      => array(
                'slug'         => 'a2zpm-project-category',
                'with_front'   => false,
                'hierarchical' => true
            ),
        ] );
    }
}
