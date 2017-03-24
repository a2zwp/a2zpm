<div class="sidebar-section" id="a2zpm-project-sidebar-section">
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

            <div class="form-group">
                <multiselect
                    v-model="selectedUsers"
                    id="ajax"
                    label="display_name"
                    track-by="ID"
                    placeholder="<?php _e( 'Type to search', A2ZPM_TEXTDOMAIN ); ?>"
                    :options="users"
                    :searchable="true"
                    :loading="isLoading"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :reset-after="true"
                    :options-limit="100"
                    :limit="3"
                    @search-change="asyncFind"
                >
                    <template slot="noResult" scope="props"><?php _e( 'Opps no user found', A2ZPM_TEXTDOMAIN ); ?></template>
                </multiselect>
            </div>

        </form>
    </div>

    <div class="footer">
        <button class="button button-primary" @click.prevent="createProject"><?php _e( 'Create Project', A2ZPM_TEXTDOMAIN ); ?></button>
        <button class="button button-default" @click.prevent="cancelSidebar"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></button>
    </div>
    <div class="a2zpm-clearfix"></div>
</div>
