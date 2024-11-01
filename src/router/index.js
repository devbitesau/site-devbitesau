
import { createRouter, createWebHistory } from 'vue-router'

const allRoutes = [
  
{
        name: 'about',
        path: '/about',
        component: () => import('../views/about.vue')
    },    
    {
        name: 'csharp',
        path: '/csharp',
        component: () => import('../views/csharp.vue')
    },    
    {
        name: 'home',
        path: '/',
        component: () => import('../views/home.vue')
    },    
    {
        name: 'monogame',
        path: '/monogame',
        component: () => import('../views/monogame.vue')
    },    
    {
        name: 'resources',
        path: '/resources',
        component: () => import('../views/resources.vue')
    },    
    {
        name: 'applications',
        path: '/resources/applications',
        component: () => import('../views/resources-applications.vue')
    },    
    {
        name: 'assets',
        path: '/resources/assets',
        component: () => import('../views/resources-assets.vue')
    },    
    {
        name: 'books',
        path: '/resources/books',
        component: () => import('../views/resources-books.vue')
    },    
    {
        name: 'gameengine',
        path: '/resources/gameengine',
        component: () => import('../views/resources-gameengine.vue')
    },    
    {
        name: 'monogamelinks',
        path: '/resources/monogamelinks',
        component: () => import('../views/resources-monogamelinks.vue')
    },    
    {
        name: 'animation',
        path: '/monogame/quickshot/animation',
        component: () => import('../views/monogame-quickshot-animation.vue')
    },    
    {
        name: 'makeitbob',
        path: '/monogame/quickshot/makeitbob',
        component: () => import('../views/monogame-quickshot-makeitbob.vue')
    },    
    {
        name: 'origins',
        path: '/monogame/quickshot/origins',
        component: () => import('../views/monogame-quickshot-origins.vue')
    },    
    {
        name: 'MG Stats',
        path: '/apps/mgstats',
        component: () => import('../apps/mgstats.vue')
    },    
    

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes
  
})

export default router
