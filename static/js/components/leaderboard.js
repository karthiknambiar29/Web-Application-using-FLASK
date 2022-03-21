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
        </div>
    `,
    methods: {
        async getLeaderboard() {
            try {
                const response = await fetch(`http://172.28.134.31:8080/api/score`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const data = await response.json();
                this.leaderboard = data.leaderboard;
                // console.log(Object.entries(this.leaderboard)[0][1][0])
            } catch(error){

            }
        }
    },
    mounted() {
        this.getLeaderboard()
    }
    
};

export default leaderboard;