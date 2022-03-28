import nav_bar from "./navbar.js";
import leaderboard from "./leaderboard.js";
import decks from "./decks.js";

var dashboard = {
    components: {
        'nav-bar': nav_bar,
        'leaderboard': leaderboard,
        'decks': decks
    },
    template: `
        <div class="container">
        <nav-bar></nav-bar>
            <div >
                <h6 style="text-align: center; margin-top: 5%;">Welcome {{ username }}</h6>
                <h2 style="text-align: left; margin-top: 5%;">Progress Chart</h2>
                <canvas class="my-4 chartjs-render-monitor" id="myChart" width="100" height="25"></canvas>
                <decks isDashboard></decks>
                <leaderboard isDashboard></leaderboard>
            </div>
        </div>
        `,
    data: function() {
      return {
          username: "",
          scores: {},
          category: [],
          isDashboard: true
        //   leaderboard: {},
        }
    },
    methods:{
        async getUser() {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/user`, {
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
                    this.username = data.username;
                    this.scores = data.scores;
                    this.category = data.category;
                    if (this.scores.scores.length > 7) {
                        this.scores.scores = this.scores.scores.slice(-7);
                        this.scores.datetimes = this.scores.datetimes.slice(-7);
                        this.scores.categories = this.scores.categories.slice(-7);
                    }
                    var categories = this.scores.categories;
                    var c = this.scores.datetimes.map(function(e, i) {
                        return [e, categories[i]]
                    })

                    var ctx = document.getElementById("myChart").getContext("2d");
                    var myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: c,
                            datasets: [{
                                data: this.scores.scores,
                                lineTension: 0,
                                backgroundColor: 'transparent',
                                borderColor: '#007bff',
                                borderWidth: 4,
                                pointBackgroundColor: '#007bff'
                            }],
                            datalabels: {
                                align: 'start',
                                anchor: 'start'
                            }
                        
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        labelString: "Percentage",
                                    display: true
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        max: 100,
                                        
                                    }
                                }],
                                xAxes: [{
                                }]
                            },
                            legend: {
                                display: false,
                            }
                        }    
                    });
                }
            } catch (error) {
                console.log('error: ', error);
            }
        },
    },
    mounted() {
        this.getUser();
    }
}

export default dashboard;