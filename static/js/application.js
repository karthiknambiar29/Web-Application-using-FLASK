import home_page from "./components/home.js"
import login_form from "./components/login.js"
import register_form from "./components/register.js"
import nav_bar from "./components/navbar.js";
import dashboard from "./components/dashboard.js"
import leaderboard from "./components/leaderboard.js"
import decks from "./components/decks.js"
import category from "./components/category.js";
import quiz from "./components/quiz.js";
import score from "./components/score.js";
import cards from "./components/cards.js";
import add_deck from "./components/adddeck.js";
import edit_deck from "./components/editdeck.js";
import add_card from "./components/addcard.js";
import edit_card from "./components/editcard.js";
import edit_password from "./components/editpassword.js";
import NotFound from "./components/NotFound.js";

const routes = [
    {
        path: '/',
        component: home_page,
    }, {
        path: "/login",
        component: login_form
    }, {
        path: "/register",
        component: register_form
    }, {
        path: '/dashboard',
        component: dashboard
    }, {
        path: "/leaderboard",
        component: leaderboard
    }, {
        path: "/decks",
        component: decks
    }, {
        path: "/start/:category_id",
        component: category,
    }, {
        path: "/quiz/:category_id/:question",
        component: quiz
    }, {
        path: "/score/:category_id",
        component: score
    }, {
        path: "/cards/:category_id",
        component: cards
    }, {
        path: "/adddeck",
        component: add_deck
    }, {
        path: "/editdeck/:category_id",
        component: edit_deck
    }, {
        path: "/addcard/:category_id",
        component: add_card
    }, {
        path: "/editcard/:card_id",
        component: edit_card
    },{
        path: "/editpassword",
        component: edit_password
    }, {
        path :'*',
        component:NotFound
    }
]


const router = new VueRouter({
    routes: routes,
})




var app = new Vue({
    el: '#app',
    router: router
})

