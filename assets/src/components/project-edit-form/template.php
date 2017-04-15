<div class="sidebar-section" id="a2zpm-project-sidebar-section">
    <div class="header">
        <h1><i class="fa fa-pencil"></i>&nbsp; <?php _e( 'Edit Project', A2ZPM_TEXTDOMAIN ); ?></h1>
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
                <multiselect
                    v-model="project.category"
                    :options="categoryOptions"
                    track-by="name"
                    label="name"
                    placeholder="<?php _e( 'Select a category', A2ZPM_TEXTDOMAIN ); ?>"
                    :value="project.category"
                  >
                  <span slot="noResult"><?php _e( 'Oops! No category found', A2ZPM_TEXTDOMAIN ); ?></span>
                </multiselect>
            </div>

            <div class="form-group">
                <multiselect
                    v-model="project.label"
                    :options="lableOptions"
                    track-by="name"
                    label="name"
                    placeholder="<?php _e( 'Choose project label', A2ZPM_TEXTDOMAIN ); ?>"
                    :value="project.label"
                  >
                  <span slot="noResult"><?php _e( 'Oops! No label found', A2ZPM_TEXTDOMAIN ); ?></span>
                </multiselect>
            </div>
        </form>
    </div>

    <div class="footer">
        <button class="button button-primary" @click.prevent="updateProject"><?php _e( 'Update Project', A2ZPM_TEXTDOMAIN ); ?></button>
        <button class="button button-default" @click.prevent="cancelSidebar"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></button>
    </div>
    <div class="a2zpm-clearfix"></div>
</div>
