import nav_bar from "./navbar.js";
var score = {
    data: function() {
        return {
            cards: {},
            result: [],
            score: 0,
        }
            
    },
    template: `
    <div>
    <nav-bar></nav-bar>
    <h1> Score </h1>
    <h3 style="text-align: center"> Your Score: {{ score }}% </h3>
    <canvas class="my-4 chartjs-render-monitor" width="100" id="myChart"></canvas>

    <b-table :items="score" borderless class="text-center"/>
    <h1> Review </h1>
        <div v-for="card in cards">
            <b-card :header="card['front']" border-variant="primary"
            :header-bg-variant="card['header']"
            header-text-variant="white"
            align="center">
            <b-card-body>
                <b-table :items="card['options']" thead-class="d-none" borderless />
            </b-card-body>
            </b-card>
            <br>
        </div>
        <div style="text-align: center; margin-top: 5%;">
            <h6>Click here to go to Dashboard</h6>
            <b-link to="/dashboard"><b-button class="submit-button" variant="outline-primary">Dashboard</b-button></b-link> 
        </div>
    </div>
    `,
    components: {
        'nav-bar': nav_bar,
    },
    methods: {
        async getScore() {
            try{
                var answers = localStorage.getItem("answers");
                answers = JSON.parse(answers);
                var card_ids = localStorage.getItem("card_ids").split(",");
                const response = await fetch(`http://127.0.0.1:8080/api/allcards`, {
                    body: JSON.stringify({"answers": answers, "card_ids":card_ids, "category_id": null}),
                    headers:{
                        Accept: "*/*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                    method: "POST",
                })

                const data = await response.json();
                if (response.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (response.status == 200) {
                    let correct = 0;
                let wrong = 0;
                let skipped = 0;  
                for (let [key, value] of Object.entries(data)) {
                    if (value.correct_ans == value.given_ans) {
                        value.header = "success"
                        correct = correct+1
                    } else if (value.given_ans == 0) {
                        value.header = "secondary"
                        skipped = skipped+1
                    } else {
                        value.header = "danger"
                        wrong = wrong + 1
                    }
                    let options = []
                    options.push({"1":"1. " + value.option_1})
                    options.push({"1":"2. " + value.option_2})
                    options.push({"1":"3. " + value.option_3})
                    options.push({"1":"4. " + value.option_4})
                    if (value.given_ans != 0) {
                        options[value.given_ans-1]["_rowVariant"] = "danger"
                    }
                    options[value.correct_ans-1]["_rowVariant"] = "success"
                    
                    // console.log(options)
                    value.options = options
                }
                // console.log(data)
                this.score = correct*10;
                this.cards = data
                this.result.push({"Correct": correct, "Wrong": wrong, "Skipped":skipped})
                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ["Correct Answer", "Wrong Answer", "Skipped"],
                        datasets: [{
                            data: [correct, wrong, skipped], 
                                backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                                ],
                                borderWidth: 1
                            }]
                    },
                    options: {
                        responsive: true, 
                        maintainAspectRatio: true, 
                    }
                });
                }
                // console.log(data)
                
                const res = await fetch(`http://127.0.0.1:8080/api/score`, {
                    body: JSON.stringify({"score": this.score, "category_id":parseInt(this.$route.params.category_id)}),
                    headers:{
                        Accept: "*/*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                    method: "POST",
                });
                if (res.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                }
            } catch (error){
                console.log(error)
            }
            
        }
    },
    mounted() {
        this.getScore();
    }
}

export default score;