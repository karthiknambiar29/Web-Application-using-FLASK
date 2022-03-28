import nav_bar from "./navbar.js";
var leaderboard = {
    props: {
        isDashboard: Boolean,
    },
    data: function() {
        return {
            leaderboard : {},
            fields:['Name', 'Score', 'Date']
        }
    },
    components: {
        'nav-bar': nav_bar
    },
    template: `
        <div class="container" >
            <div v-if="!isDashboard">
                <nav-bar></nav-bar>
            </div>
            <h2 style="text-align: left; margin-top: 5%;">Leaderboard</h2>
            <div style="text-align: center; margin-top: 5%;" v-for="[category, board] in Object.entries(leaderboard)">
                <div>
                    <h4>{{ category }}</h4>
                    <b-table striped  outlined responsive hover :items="board" :fields="fields"></b-table>
                </div>
                <br>
            </div>
            <div style="text-align: center; margin-top: 5%;">
                <h6>Click here to go to Dashboard</h6>
                <b-link to="/dashboard"><b-button class="submit-button" variant="outline-primary">Dashboard</b-button></b-link> 
            </div>
        </div>
    `,
    methods: {
        async getLeaderboard() {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/score`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const data = await response.json();
                if (response.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (response.status == 200) {
                    this.leaderboard = data.leaderboard;
                }
            } catch(error){
                console.log(error)
            }
        }
    },
    mounted() {
        this.getLeaderboard()
    }
    
};

export default leaderboard;