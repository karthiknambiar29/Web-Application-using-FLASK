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
                const response = await fetch(`http://172.28.134.31:8080/api/user`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const data = await response.json();
                this.username = data.username;
                this.scores = data.scores;
                this.category = data.category;
                // this.leaderboard = data.leaderboard;
                // console.log(this.leaderboard)
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
                            ticks: {
                                beginAtZero: true,
                                max: 10,
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
                // console.log(this.scores.scores.length)
            } catch (error) {
                console.log('error: ', error);
            }
        },
        // async getScore() {
        //     try{
        //         const response = await fetch(`http://172.28.134.31:8080/api/user`, {
        //             method : 'GET',
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
        //             }
        //         })
        //         const data = await response.json();
        //         this.scores = data
        //     } catch(error) {

        //     }
        // }
    },
    mounted() {
        this.getUser();
        // this.plotChart();
        // this.renderChart({
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //     datasets: [
        //     {
        //         label: 'Data One',
        //         backgroundColor: '#f87979',
        //         data: [40, 39, 10, 40, 39, 80, 40]
        //     }
        //     ]
        // }, {responsive: true, maintainAspectRatio: false})
    }
    // methods: {
    //     checkForm: function(e) {
    //         this.errors = [];
    //         if (this.username.length <= 5) {
    //             this.errors.push("Username should have 6 or more characters!!");
    //         } 
    //         if (this.password.length <= 5) {
    //             this.errors.push("Password should have 6 or more characters!!");
    //         }
    //         if (!this.errors.length) {
    //             return this.login();
    //         } else {
    //             alert(this.errors.join("\n"))
    //         }
    //         e.preventDefault();
    //     },
    //     async login() {
    //         try {
    //             const response = await fetch(`http://172.28.134.31:8080/api/user`, {
    //                 body: JSON.stringify({"name":this.username, "password":this.password}),
    //                 headers: {
    //                   Accept: "*/*",
    //                   "Content-Type": "application/json"
    //                 },
    //                 method: "POST",
    //                 })
    //             if (response.status == 404) {
    //                 // this.error_username_password = true;
    //                 alert("Username or Password not correct!!")
    //                 this.username = "";
    //                 this.password = "";
    //             } else if (response.status == 200) {
    //                 const data = await response.json();
    //                 console.log("Success:" , data)
                    
    //             }

    //         } catch(error) {
    //             console.log('Error:', error);
    //         }
    //     },
    // },
}

export default dashboard;