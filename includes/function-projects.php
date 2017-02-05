<?php

// don't call the file directly
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}


/**
* Get project label
*
* @since 1.0.0
*
* @return void
**/
function a2zpm_get_project_label( $label = '' ) {
    $labels = apply_filters( 'a2zpm_project_label', [
        'new' => [
            'label' => __( 'New', A2ZPM_TEXTDOMAIN ),
            'class' => 'info'
        ],

        'inprogress' => [
            'label' => __( 'In Progress', A2ZPM_TEXTDOMAIN ),
            'class' => 'primary'
        ],

        'paused' => [
            'label' => __( 'Paused', A2ZPM_TEXTDOMAIN ),
            'class' => 'warning'
        ],

        'canceled' => [
            'label' => __( 'Canceled', A2ZPM_TEXTDOMAIN ),
            'class' => 'error'
        ]
    ] );

    if ( !empty( $label ) ) {
        return $labels[$label];
    }

    return $labels;
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












