<?php

/**
 * Get all projects
 *
 * @since 1.0.0
 *
 * @return void
 **/
function a2zpm_get_projects( $args = [] ) {

    $defaults = array(
        'post_type'      => 'project',
        'post_status'    => 'any',
        'order'          => 'DESC',
        'orderby'        => 'date',
        'posts_per_page' => 10,
    );

    $args = wp_parse_args( $args, $defaults );

    $query = new WP_Query( apply_filters( 'a2zpm_get_projects', $args ) );

    if ( $query->posts ) {
        return $query->posts;
    }

    return false;
}

/**
* Get all project category
*
* @since 1.0.0
*
* @return void
**/
function a2zpm_get_project_category( $param ) {

    $defaults = array(
        'class'            => '',
        'child_of'         => 0,
        'depth'            => 0,
        'echo'             => 0,
        'hide_empty'       => 0,
        'hide_if_empty'    => 0,
        'hierarchical'     => true,
        'name'             => 'project_cat',
        'order'            => 'ASC',
        'orderby'          => 'name',
        'selected'         => '',
        'tab_index'        => 0,
        'taxonomy'         => 'a2zpm_project_category',
    );

    $args = wp_parse_args( $param, $defaults );

    $args = apply_filters( 'cpm_category_dropdown', $args );

    return wp_dropdown_categories( $args );
}












