<div class="a2zpm-task-lists">
    <div class="task-list a2zpm-left">
        <div class="search-box">
            <input type="text" name="search-todo-list" placeholder="Search..">
        </div>
        <ul class="task-list-item">
            <router-link :to="'/project/' + $route.params.id + '/tasklists/my-task'" tag="li" class="my-task" active-class="acitve" exact><i class="fa fa-list-alt" aria-hidden="true"></i> My Task</router-link>
            <router-link :to="'/project/' + $route.params.id + '/tasklists/pinnned'" tag="li" class="pinned-task" active-class="acitve"><i class="fa fa-thumb-tack" aria-hidden="true"></i> Pinned</router-link>
            <router-link :to="'/project/' + $route.params.id + '/tasklists/1232'" tag="li" class="list" active-class="acitve"><i class="fa fa-list-alt" aria-hidden="true"></i> List 1</router-link>
            <router-link :to="'/project/' + $route.params.id + '/tasklists/1234'" tag="li" class="list" active-class="acitve"><i class="fa fa-list-alt" aria-hidden="true"></i> List 2</router-link>
            <router-link :to="'/project/' + $route.params.id + '/tasklists/1235'" tag="li" class="list" active-class="acitve"><i class="fa fa-list-alt" aria-hidden="true"></i> List 3</router-link>
            <!-- <li class="pinned-task"><i class="fa fa-thumb-tack" aria-hidden="true"></i> Pinned</li> -->
            <!-- <li class="list"><i class="fa fa-list" aria-hidden="true"></i> List 1 <i class="fa edit fa-pencil" aria-hidden="true"></i></li> -->
        </ul>
        <div class="new-list-wrap">
            <a href="#"><i class="fa fa-plus" aria-hidden="true"></i> Create New List</a>
        </div>
    </div>
    <div class="task-todos a2zpm-right">

        <router-view></router-view>

        <!-- <div class="task-list-name">
            <h3>This is a simple task list</h3>
        </div>
        <div class="task-list-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Sabbir ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Mishu ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Sk ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
            <p>Rafsun ipsum dolor sit amet, consectetur adipisicing elit. Dolore quo perferendis, ad alias sed deleniti harum incidunt tenetur aliquid deserunt reiciendis, totam officiis dolorum eius rerum commodi tempore reprehenderit animi.</p>
        </div> -->
    </div>
    <div class="a2zpm-clearfix"></div>
</div>