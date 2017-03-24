<div class="project-section">
    <div class="wrap project-wrapper" :class="{ slide: isSlide }">
        <h2>
            <?php _e( 'Projects', A2ZPM_TEXTDOMAIN ); ?>
            <router-link id="a2zpm-add-new-prject" class="add-new-h2" to="/projects/add" @click.native="isSlide=true" ><?php _e( 'Add new project', A2ZPM_TEXTDOMAIN ); ?></router-link>
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
                                    <router-link tag="li" :to="{ name: 'a2zpm_project_edit', params:{ id: project.ID } }" @click.native="isSlide=true" ><a href="#"><i class="fa fa-pencil" aria-hidden="true"></i> <?php _e( 'Edit', A2ZPM_TEXTDOMAIN ); ?></a></router-link>
                                    <!-- <li><a href="#" @click.prevent="editProject( project )"><i class="fa fa-pencil" aria-hidden="true"></i> <?php _e( 'Edit', A2ZPM_TEXTDOMAIN ); ?></a></li> -->
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
                            <span v-if="project.label.id" class="a2zpm-label label" :class="showProjectLabel(project.label)">{{project.label.name}}</span>
                        </div>
                        <div class="a2zpm-clearfix"></div>
                    </div>
                </li>

            </ul>
            <div class="a2zpm-clearfix"></div>
        </div>
    </div>

    <router-view></router-view>

    <div class="a2zpm-clearfix"></div>
</div>