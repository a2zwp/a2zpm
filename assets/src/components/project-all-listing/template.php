<div class="project-section">
    <div class="wrap project-wrapper" :class="{ slide: isSlide }">
        <h2>
            <?php _e( 'Projects', A2ZPM_TEXTDOMAIN ); ?>

            <router-link id="a2zpm-add-new-prject" class="add-new-h2" to="project/add"></router-link>
            <a href="#" id="a2zpm-add-new-prject" class="add-new-h2" @click="toggleProjectSidebar"><?php _e( 'Add new project', A2ZPM_TEXTDOMAIN ); ?></a>
        </h2>
        <hr>

        <div class="project-list" id="a2zpm-project-list">
            <ul>
                <li v-for="project, index in projects" class="project-item">
                    <div class="project-item-header">
                        <router-link :to="'/project/' + project.ID" tag="h2">{{ project.title }}</router-link>

                        <div class="settings">
                            <span class="manage-team">
                                <a href="#" v-tooltip title="<?php _e( 'Invite user and Manage team', A2ZPM_TEXTDOMAIN ); ?>" @click.prevent="manageTeam( project )"><i class="fa fa-user"></i></a>
                            </span>
                            <span class="dropdown">
                                <a data-target="#" v-tooltip class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="<?php _e( 'Settings', A2ZPM_TEXTDOMAIN ); ?>">
                                    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                </a>
                                <ul class="dropdown-menu a2zpm-right" aria-labelledby="dropdownMenu1">
                                    <li><a href="#" @click.prevent="editProject( project )"><i class="fa fa-pencil" aria-hidden="true"></i> <?php _e( 'Edit', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                    <li><a href="#"><i class="fa fa-users" aria-hidden="true"></i> <?php _e( 'Manage Team', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                    <li><a href="#"><i class="fa fa-link" aria-hidden="true"></i> <?php _e( 'Mark as completed', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                    <li><a href="#" @click.prevent="archiveProject( index, project )"><i class="fa fa-archive" aria-hidden="true"></i> <?php _e( 'Make Archive', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                    <li role="separator" class="divider"></li>
                                    <li><a href="#" @click.prevent="deleteProject( index, project )"><i class="fa fa-trash" aria-hidden="true"></i> <?php _e( 'Delete', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                </ul>
                            </span>
                        </div>
                    </div>
                    <div class="project-item-content">
                        <div class="project-item-category">
                            <i class="fa fa-tags"></i> {{ project.category.name }}
                        </div>
                        <div class="project-item-description">
                            <p>{{ project.content }}</p>
                        </div>
                    </div>
                    <div class="project-item-footer">
                        <div class="date a2zpm-left">
                            <?php _e( 'Created at ', A2ZPM_TEXTDOMAIN ) ?>{{ createAt( project.created_at ) }}
                        </div>
                        <div class="status a2zpm-right">
                            <span class="a2zpm-label label label-success">Active</span>
                        </div>
                        <div class="a2zpm-clearfix"></div>
                    </div>
                </li>

            </ul>
            <div class="a2zpm-clearfix"></div>
        </div>
    </div>

    <div class="sidebar-section" id="a2zpm-project-sidebar-section" v-show="isSlide && !isManageTeam">
        <div class="header">
            <h1 v-if="!isEditProject"><?php _e( 'Create a project', A2ZPM_TEXTDOMAIN ) ?></h1>
            <h1 v-else><?php _e( 'Edit this project', A2ZPM_TEXTDOMAIN ) ?></h1>
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
            <button v-if="!isEditProject" class="button button-primary" @click.prevent="createProject"><?php _e( 'Create Project', A2ZPM_TEXTDOMAIN ); ?></button>
            <button v-if="isEditProject" class="button button-primary" @click.prevent="createProject"><?php _e( 'Update Project', A2ZPM_TEXTDOMAIN ); ?></button>
            <button class="button button-default" @click.prevent="cancelSidebar"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></button>
        </div>
        <div class="a2zpm-clearfix"></div>
    </div>

    <!-- <div class="sidebar-section" id="a2zpm-project-sidebar-section" v-show="isSlide && isManageTeam">
        <div class="header">
            <h1><?php _e( 'Manage team', A2ZPM_TEXTDOMAIN ); ?></h1>
        </div>
        <div class="content">
            <form action="" class="a2zpm-from-horizontal">
                <div class="form-group">
                    <select class="form-control a2zpm-serach-user" v-model="project.users" multiple placeholder="<?php _e( 'Add user...', A2ZPM_TEXTDOMAIN ); ?>"></select>
                </div>
            </form>
        </div>

        <div class="footer">
            <button class="button button-primary" @click.prevent="saveTeam"><?php _e( 'Save team', A2ZPM_TEXTDOMAIN ); ?></button>
            <button class="button button-default" @click.prevent="cancelSidebar"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></button>
        </div>
        <div class="a2zpm-clearfix"></div>
    </div> -->

    <div class="a2zpm-clearfix"></div>
</div>