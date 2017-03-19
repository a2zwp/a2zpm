<div id="a2zpm-single-project" class="a2zpm-single-project wrap" v-if="isReady">
    <div class="top-wrap">
        <div class="project-heading">
            <h1 class="title">Signle Project</h1>
            <p class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat, eaque.</p>
        </div>
    </div>
    <div class="project-nav">
        <ul>
            <li><router-link :to="'/project/' + project.ID + '/tasklists'" active-class="tab-acitve">Todos</router-link></li>
            <li><router-link :to="'/project/' + project.ID + '/files'" active-class="tab-acitve">Files</router-link></li>
            <!-- <li><a href="#">Lists & Todos</a></li>
            <li><a href="#">Files</a></li>
            <li><a href="#">Discussion</a></li>
            <li><a href="#">Notes</a></li> -->
        </ul>
    </div>

    <div class="project-nav-content">
        <router-view></router-view>
    </div>
</div>