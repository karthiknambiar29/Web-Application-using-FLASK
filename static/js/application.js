import home_page from "./components/home.js"
import login_form from "./components/login.js"
import register_form from "./components/register.js"
import nav_bar from "./components/navbar.js";
import dashboard from "./components/dashboard.js"
import leaderboard from "./components/leaderboard.js"
import decks from "./components/decks.js"


const routes = [
    {
        path: '/',
        component: home_page,
    },{
        path :"/login",
        component: login_form
    },{
        path: "/register",
        component: register_form
    },{
        path: '/dashboard',
        component: dashboard
    },
    {
        path: "/leaderboard",
        component: leaderboard
    },{
        path: "/decks",
        component: decks
    }
]

const router = new VueRouter({
    routes: routes,
    // mode: 'history'
})




var app = new Vue({
    el: '#app',
    router: router
    // router:router,
})

