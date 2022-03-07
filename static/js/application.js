import home_page from "./components/home.js"
import login_form from "./components/login.js"
import register_form from "./components/register.js"
import dashboard from "./components/dashboard.js"


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
    }
]

const router = new VueRouter({
    routes: routes,
    // mode: 'history'
})


// async function protected() {
//     const options = {
//         method : 'GET',
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem('jwt')}`,
//         }
//     };
//     fetch(`http://172.28.134.31:8080/protected`, options)
//     .then(response => response.json())
//     .then(data => console.log('Success:', data))
//     .catch((error) => {
//         console.log('Error:', error)
//     })
// }



var app = new Vue({
    el: '#app',
    router: router
    // router:router,
})

