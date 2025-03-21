import router from "./router.js"
import Navbar from "./components/Navbar.js"

//const isAuthenticated = localStorage.getItem(`auth-token`) ? true : false

//  router.beforeEach((to, from, next) => {
//      if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//      else next()
//    })

// router.beforeEach((to, from, next) => {
//     if (to.name !== 'Login' && !localStorage.getItem(`auth-token`) ? true : false) next({ name: 'Login' })
//     else next()
//   })

router.beforeEach((to, from, next) => {
    const publicPages = ['Login', 'Signup','Home']; // Add all public route names here
    const authRequired = !publicPages.includes(to.name);
    const isLoggedIn = !!localStorage.getItem('auth-token');

    if (authRequired && !isLoggedIn) {
        next({ name: 'Login' });
    } else {
        next();
    }
});



new Vue({
    el:"#app",
    template: `<div>
    <Navbar :key='has_changed'/>
    <router-view class="m-3"/></div>`,
    router,
    components:{
        Navbar,
    },
    data:{
        has_changed:true,
    },
    watch:{
        $route(){
            this.has_changed=!this.has_changed

        },
    },
})