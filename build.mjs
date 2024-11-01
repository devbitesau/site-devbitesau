import markdownit from 'markdown-it'
import fs from 'fs'
import hljs from 'highlight.js' // https://highlightjs.org
import { tab } from "@mdit/plugin-tab";
import { spoiler } from "@mdit/plugin-spoiler";
import { alert } from "@mdit/plugin-alert";
import CodeTabs from 'markdown-it-codetabs'
import { title } from 'process';


const contentPath = 'content'
const viewOutputPath = 'src/views'
const viewAssetPath = 'src/assets'
const buildBase = 'src'
const routesPath = 'src/router/index.js'
const linksPath = 'src/MenuLinks.js'

if (!fs.existsSync(buildBase)) {
    fs.mkdirSync(buildBase)
}

if (!fs.existsSync(viewOutputPath)) {
    fs.mkdirSync(viewOutputPath)
}
if (!fs.existsSync(viewAssetPath)) {
    fs.mkdirSync(viewAssetPath)
}
if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath)
}

const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (__) {}
        }
        return '';
      }
}).use(tab,{name: 'tabs'}).use(spoiler).use(alert).use(CodeTabs);

const defaultRender = md.renderer.rules.image
md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    token.attrSet('src', `@/assets${env.imgTopPath}/${token.attrGet('src')}`)
    return defaultRender(tokens, idx, options, env, self)
}

class VueMdView {
    constructor() {
        this.renderedText = ''
        this.parameters = {}
        this.name = ''
        this.route = ''
        this.fileName = ''
        this.script = ''
        this.style = ''
        this.title = ''
        this.type = null
    }
}

function getAllFiles(dirPath) {

    var fileList = fs.readdirSync(dirPath, { recursive: true, withFileTypes: true });

    return fileList
}

function readFile(file) {
    var rawFile = fs.readFileSync(file.path + "/" + file.name, 'utf8')
    var endIndex = rawFile.lastIndexOf('====') + 4

    var headerContent = rawFile.slice(0, endIndex).replaceAll('=', '')
    var headerParsed = JSON.parse(headerContent)
    var mdContent = rawFile.slice(endIndex)

    var string = "<template><div>\n" + md.render(mdContent,{imgTopPath: file.pathNormalized}) + "\n</div></template>";


    let vueView = new VueMdView()
    vueView.parameters = headerParsed
    vueView.name = file.nameOnly
    vueView.fileName = file.pathNormalized + '/' + file.nameOnly + '.vue'
    vueView.fileName = vueView.fileName.replace('/', '').replaceAll('/', '-')
    vueView.route = file.pathNormalized + '/' + file.nameOnly
    vueView.renderedText = string
    vueView.title = headerParsed?.title ?? file.nameOnly


    if (headerParsed.isRoot) {
        vueView.route = '/'
    }

    if (headerParsed.style) {
        vueView.style = '\n<style>\n' + headerParsed.style + '\n</style>\n'
    }
    if (headerParsed.script) {
        vueView.script = '\n<style>\n' + headerParsed.script + '\n</style>\n'
    }

    return vueView
}

let views = []
let fileList = getAllFiles(contentPath)

fileList.forEach((file) => {

    var fileExtension = file.name.split('.').pop()
    var fileName = file.name.split('.')[0]
    fileExtension = (fileExtension === file.name) ? '' : fileExtension

    file.nameOnly = fileName
    file.extension = fileExtension
    file.pathNormalized = file.parentPath.replaceAll('\\', '/').replace(contentPath, '')


    if (file.isFile() && fileExtension === 'md') {
        let vueView = readFile(file)
        views.push(vueView)

        fs.writeFileSync(viewOutputPath + '/' + vueView.fileName, vueView.renderedText + vueView.style + vueView.script)

    } else if (!file.isDirectory()) {
        if (!fs.existsSync(viewAssetPath + '/' + file.pathNormalized)) {
            fs.mkdirSync(viewAssetPath + '/' + file.pathNormalized, { recursive: true })
        }
        fs.copyFileSync(file.parentPath + '/' + file.name, viewAssetPath + '/' + file.pathNormalized + '/' + file.name)
    }
})

function stringifyRoute(route) {

    var type = route?.type ?? "views"

    return `{
        name: '${route.name}',
        path: '${route.route}',
        component: () => import('../${type}/${route.fileName}')
    },    
    `
}

function stringifyRoutes(views) {
    const routesTemplate = `
import { createRouter, createWebHistory } from 'vue-router'

const allRoutes = [
  ...Routes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes
  
})

export default router
`

    let routes = '\n'
    views.forEach((view) => {
        routes += stringifyRoute(view)
    })

    routes += '\n'
    return routesTemplate.replaceAll("...Routes", routes)
}

function stringifyLinks(categories) {
    const routesTemplate = `

const menuLinks = 
  ...Links


export default menuLinks
`

    return routesTemplate.replaceAll("...Links", JSON.stringify(categories))

}

var menuItems = []

views.forEach((view) => {
    var layout = view.parameters.layout ?? "content"
    var category = view.parameters.category ?? "Other"
    var chapter = view.parameters.chapter ?? "Other"
    var order = view.parameters.order ?? 0
    var name = view.title
    var path = view.route


    menuItems.push({
        name: name,
        path: path,
        layout: layout,
        category: category,
        chapter: chapter,
        order: order
    })
})

views.push({
    name: "MG Stats",
    title: "MG Stats",
    route: "/apps/mgstats",
    layout: "full",
    category: "Apps",
    chapter: "MG Stats",
    order: 0,
    type: "apps",
    fileName: "mgstats.vue"
})


var links = stringifyLinks(menuItems)
var routes = stringifyRoutes(views)
fs.writeFileSync(routesPath, routes)
fs.writeFileSync(linksPath, links)

