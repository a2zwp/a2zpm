<div class="sidebar-section">
    <div class="header">
        <h1><?php _e( 'Create a project', A2ZPM_TEXTDOMAIN ) ?></h1>
    </div>
    <div class="content">
        <form action="" class="a2zpm-from-horizontal">
            <div class="form-group">
                <input type="text" class="form-control" v-model="project.title" placeholder="<?php _e( 'Enter project title', A2ZPM_TEXTDOMAIN ); ?>">
            </div>

            <div class="form-group">
                <textarea id="" rows="5" class="form-control" v-model="project.content" placeholder="<?php _e( 'Enter your project description..', A2ZPM_TEXTDOMAIN ); ?>"></textarea>
            </div>

            <div class="form-group">
                <?php
                    $project_cat = a2zpm_get_project_category( [ 'class' => 'form-control a2zpm-selectize a2zpm-project-category-select' ] );
                    echo str_replace( '<select', '<select v-model="project.category" placeholder="'. __( 'Select category', A2ZPM_TEXTDOMAIN ) .'"', $project_cat );
                ?>
            </div>

            <div class="form-group">
                <select class="form-control a2zpm-serach-user" v-model="project.users" multiple placeholder="<?php _e( 'Add user...', A2ZPM_TEXTDOMAIN ); ?>"></select>
            </div>
        </form>
    </div>

    <div class="footer">
        <button class="button button-primary"><?php _e( 'Create Project', A2ZPM_TEXTDOMAIN ); ?></button>
        <button class="button button-default"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></button>
    </div>
    <div class="a2zpm-clearfix"></div>
</div>