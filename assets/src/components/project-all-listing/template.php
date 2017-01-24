<div class="project-section">
    <div class="wrap project-wrapper" :class="{ slide: isSlide }">
        <h2>
            Projects
            <a href="#" id="a2zpm-add-new-prject" class="add-new-h2" @click="addNewProjectSidebar">Add New Project</a>
        </h2>
        <hr>

        <div class="project-list">
            <ul>
                <li>
                    <h2>Project Title 1</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, magni.</p>
                </li>
                <li>
                    <h2>Project Title 1</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, magni.</p>
                </li>
                <li>
                    <h2>Project Title 1</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, magni.</p>
                </li>
                <li>
                    <h2>Project Title 1</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, magni.</p>
                </li>

                <div class="a2zpm-clearfix"></div>
            </ul>
        </div>
    </div>

    <!-- <transition name="slideRight"> -->
        <project-sidebar v-if="isSlide"></project-sidebar>
    <!-- </transition> -->

    <div class="a2zpm-clearfix"></div>
</div>