var nav_bar = {
    template: `
    <div>
        <b-navbar toggleable="lg" type="light" variant="light">
            <b-link to="/dashboard" style="text-decoration: none"><b-navbar-brand>Flashcard</b-navbar-brand></b-link>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-navbar-nav class="ms-auto">
                <b-nav-item right><b-link to="/leaderboard" style="text-decoration: none">Leaderboard</b-link></b-nav-item>
                <b-nav-item right><b-link to="/decks" style="text-decoration: none">Decks</b-link></b-nav-item>
                <b-nav-item right><b-link to="/editpassword" style="text-decoration: none">Edit Password</b-link></b-nav-item>
                <b-nav-item right><b-link @click="deleteUser" style="text-decoration: none">Delete Profile</b-link></b-nav-item>
                <b-nav-item right><b-link @click="logout" style="text-decoration: none">Sign Out</b-link></b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
    `,
    methods: {
        logout() {
            localStorage.removeItem("jwt-token")
            localStorage.removeItem("card_ids")
            localStorage.removeItem("answers")
            this.$router.push({path:"/"})
        },
        async deleteUser() {
            try {
                const res = await fetch(`http://127.0.0.1:8080/api/user`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                
                if (res.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (res.status == 200) {
                    this.$router.push({path: "/"})
                }
            } catch (error) {
                console.log(error)
            }
        },
       
    }
}

export default nav_bar;