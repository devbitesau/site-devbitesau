<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref , watch} from 'vue'
import MenuLinks from './MenuLinks.js'

const route = useRoute()

var title = ref("Dev Bites");
const pageLayout = ref("full");
const pageCategory = ref("Other");
const pagePath = ref("/");
const pageMenu = ref([])


watch(
  () => route.path,
  () => {
    pagePath.value = route.path
    var link = MenuLinks.find(item => item.path === route.path)

    pageLayout.value = link?.layout ?? "full"

    pageCategory.value = link?.category ?? "Other"

    var catLinks = MenuLinks.filter(item => item.category === pageCategory.value)

    var chapterTitles = [...new Set(catLinks.map(item => item.chapter))].sort()
    var menu = []
    chapterTitles.forEach(chapter => {
      menu.push({ name: chapter, links: catLinks.filter(item => item.chapter === chapter).sort((a, b) => a.order - b.order) })
    });

    pageMenu.value = menu
  })

</script>



<template>
  <div class="fullBackground"></div>

  <header class="prettyHeaderFixed">
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="container">

      <nav>
        <ul>
          <li>
            <RouterLink to="/"><strong>{{ title }}</strong></RouterLink>
          </li>
        </ul>
        <ul>
          <li>
            <RouterLink class="RouterLink" to="/csharp">C#</RouterLink>
          </li>
          <li>
            <RouterLink class="RouterLink" to="/monogame">MonoGame</RouterLink>
          </li>
          <li>
            <RouterLink class="RouterLink" to="/resources">Resources</RouterLink>
          </li>
        </ul>
        <ul>
          <li>
            <unicon name="github" fill="black"></unicon>
          </li>
          <li>
            <unicon name="youtube" fill="black"></unicon>
          </li>
          <li>
            <unicon name="twitter" fill="black"></unicon>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <div class="spacer"></div>
  <main class="container ">



    <div v-if="pageLayout == 'full'">

      <RouterView />
    </div>

    <div v-else-if="pageLayout == 'content'" class="parent">
      <div class="div1">
        <article style="position: sticky; top: 100px;">
          <header class="prettyHeader"><strong>{{ pageCategory }}</strong></header>

          <details v-for="chapter in pageMenu">

            <summary>{{ chapter.name }}</summary>
              <RouterLink v-for="item in chapter.links" class="contentLinks"  :to="item.path">{{ item.name }}</RouterLink>
          </details>


        </article>
      </div>
      <div class="div2">
        <RouterView />

        <!-- <router-view v-slot="{ Component }">
                
                <transition name="fade" :duration="50" mode="out-in">
                 <div :key="$route.path">
                  <component :is="Component" />
                 </div>
                </transition>
              </router-view> -->


      </div>
    </div>


  </main>
</template>

<style scoped>

.contentLinks {
  padding-left: 20px; 
  margin-top: 5px; 
  margin-bottom: 5px; 
  display: block;
  text-decoration: none;
  color: black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.prettyHeaderFixed {
  background: rgba(238, 226, 226, 0.2);
  border-radius: 2px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  width: 100%;
  z-index: 1;
  font-size: x-large;
  background: linear-gradient(to right, rgba(183, 231, 170, 0.527), rgba(253, 253, 253, 0.863), rgba(183, 231, 170, 0.527));
}

.prettyHeader {
  background: rgba(238, 226, 226, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);

  position: relative;
  z-index: 0;
  padding: 10px;
  font-size: medium;
  background: linear-gradient(to right, rgba(183, 231, 170, 0.527), rgba(253, 253, 253, 0.863));
}

.prettyFooter {
  background: rgba(238, 226, 226, 0.2);
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 0;
  padding: 5px;
  font-size: smaller;
  height: 35px;
  ;
  background: linear-gradient(to right, rgba(253, 253, 253, 0.863), rgba(212, 212, 212, 0.527));
}

.spacer {
  height: 140px;
}

.RouterLink {
  font-size: medium;
}

.parent {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 0px;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;


}

.div2 {
  grid-area: 1 / 2 / 2 / 6;

}

summary {
  /* From https://css.glass */
  background: linear-gradient(to right, rgba(253, 253, 253, 0.863), rgba(198, 218, 199, 0.26));
  border-radius: 4px;
  border: 1px solid rgba(181, 206, 170, 0.185);


  padding: 10px;

}
</style>