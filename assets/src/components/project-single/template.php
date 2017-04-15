<div id="a2zpm-single-project" class="a2zpm-single-project wrap" v-if="isReady">
    <div class="top-wrap">
        <div class="project-heading">
            <h1 class="title">{{ project.title }}</h1>
            <p class="description">{{ project.content }}</p>

        </div>

        <div class="project-nav">
            <ul>
                <li>
                    <router-link :to="'/project/' + project.ID + '/'" exact active-class="tab-acitve">
                        <i class="fa fa-th-list" aria-hidden="true"></i> Todos
                    </router-link>
                </li>
                <li>
                    <router-link :to="'/project/' + project.ID + '/files'" active-class="tab-acitve">
                        <i class="fa fa-file-text" aria-hidden="true"></i> Files
                    </router-link>
                </li>
                <!-- <li><a href="#">Lists & Todos</a></li>
                <li><a href="#">Files</a></li>
                <li><a href="#">Discussion</a></li>
                <li><a href="#">Notes</a></li> -->
            </ul>
        </div>
    </div>

    <div class="project-nav-content">
        <router-view></router-view>
    </div>
</div>