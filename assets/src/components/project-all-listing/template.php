<div class="project-section">
    <div class="wrap project-wrapper" :class="{ slide: isSlide }">
        <h2>
            <?php _e( 'Projects', A2ZPM_TEXTDOMAIN ); ?>
            <a href="#" id="a2zpm-add-new-prject" class="add-new-h2" @click="toggleProjectSidebar"><?php _e( 'Add new project', A2ZPM_TEXTDOMAIN ); ?></a>
        </h2>
        <hr>

        <div class="project-list" id="a2zpm-project-list">
            <ul>
                <li v-for="project, index in projects" class="project-item">
                    <div class="project-item-header">
                        <h2>{{ project.title }}</h2>

                        <span class="settings dropdown">
                            <a data-target="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                            </a>
                            <ul class="dropdown-menu a2zpm-right" aria-labelledby="dropdownMenu1">
                                <li><a href="#" @click.prevent="editProject( project )"><i class="fa fa-pencil" aria-hidden="true"></i> <?php _e( 'Edit', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                <li><a href="#"><i class="fa fa-users" aria-hidden="true"></i> <?php _e( 'Manage Team', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                <li><a href="#"><i class="fa fa-link" aria-hidden="true"></i> <?php _e( 'Lable change', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                <li><a href="#" @click.prevent="archiveProject( index, project )"><i class="fa fa-archive" aria-hidden="true"></i> <?php _e( 'Make Archive', A2ZPM_TEXTDOMAIN ); ?></a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#" @click.prevent="deleteProject( index, project )"><i class="fa fa-trash" aria-hidden="true"></i> <?php _e( 'Delete', A2ZPM_TEXTDOMAIN ); ?></a></li>
                            </ul>
                        </span>

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

    <div class="sidebar-section" id="a2zpm-project-sidebar-section" v-show="isSlide">
        <div class="header">
            <h1 ><?php _e( 'Create a project', A2ZPM_TEXTDOMAIN ) ?></h1>
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

                    <!-- <template v-if="!isCreateNewUser"> -->
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
                            :limit-text="limitText"
                            @search-change="asyncFind"
                            @select="pushProjectUser"
                        >
                            <template slot="noResult" scope="props"><?php _e( 'Opps no user found', A2ZPM_TEXTDOMAIN ); ?></template>
                        </multiselect>
                        <!-- <a href="#" class="a2zpm-right" @click.prevent="isCreateNewUser = !isCreateNewUser"><?php _e( 'Invite new', A2ZPM_TEXTDOMAIN ); ?></a> -->
                    <!-- </template> -->

                    <!-- <template v-if="isCreateNewUser">
                        <input type="email" class="form-control" v-model="newUser.email" @keyup.prevent="validateUserEmail" placeholder="<?php _e( 'Enter a valid email address', A2ZPM_TEXTDOMAIN ); ?>">
                        <span class="a2zpm-left" v-if="!isValid">{{ newUser.validationError }}</span>
                        <span class="a2zpm-right"><a href="#" @click.prevent="isCreateNewUser = !isCreateNewUser"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></a></span>
                        <div class="a2zpm-clearfix"></div>
                    </template> -->
                </div>
            </form>
        </div>

        <div class="footer">
            <button class="button button-primary" @click.prevent="createProject"><?php _e( 'Create Project', A2ZPM_TEXTDOMAIN ); ?></button>
            <button class="button button-default" @click.prevent="cancelCreateProject"><?php _e( 'Cancel', A2ZPM_TEXTDOMAIN ); ?></button>
        </div>
        <div class="a2zpm-clearfix"></div>
    </div>

    <!-- <project-sidebar v-show="isSlide" @cancelSidebar="isSlide = $event"></project-sidebar> -->

    <div class="a2zpm-clearfix"></div>
</div>