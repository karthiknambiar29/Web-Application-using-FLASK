var quiz = {
    data: function() {
        return {
            additional: [],
            additional_grouped: [],
            options: [],
            title: "",
        }
    },
    template: `
        <div>
            <b-card :title="title" border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center">
                <b-form-group>
                    <b-form-radio-group
                        id="checkbox"
                        v-model="additional_grouped"
                        :options="options"></b-form-radio-group>
                </b-form-group>
            </b-card>
            <br>
            <div class="text-center">
                <b-button style="text-align:center" class="submit-button text-center" @click="nextQuestion" variant="outline-primary">Next</b-button>
            </div>
        </div>
    `,
    methods: {
        async getCard() {
            try {
                var card_id = localStorage.getItem("card_ids").split(",")[parseInt(this.$route.params.question)-1]
                console.log(typeof(localStorage.getItem("card_ids")))
                const response = await fetch(`http://172.28.134.31:8080/api/card/${card_id}`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const data = await response.json();
                console.log(data)
                // console.log(this.$route.params.id)
                this.title = data.front;
                this.options = []
                this.options.push({text: data.option_1, value: "1"})
                this.options.push({text: data.option_2, value: "2"})
                this.options.push({text: data.option_3, value: "3"})
                this.options.push({text: data.option_4, value: "4"})
                
            } catch (error) {
                console.log(error)
            }
        },
        nextQuestion() {
            var answers = localStorage.getItem("answers");
            if (!answers) {
                const keys = parseInt(this.$route.params.question);
                console.log(typeof(keys))
                let ans = {};
                ans[keys] = this.additional_grouped[0]
                ans = JSON.stringify(ans)
                localStorage.setItem('answers', ans)
            } else {
                let ans = JSON.parse(answers)
                const keys = parseInt(this.$route.params.question);
                ans[keys] = this.additional_grouped[0]
                ans = JSON.stringify(ans)
                localStorage.removeItem("answers")
                localStorage.setItem('answers', ans)
            }
            if (parseInt(this.$route.params.question) < 10) {
                this.$router.push({path: `/quiz/${this.$route.params.category_id}/${parseInt(this.$route.params.question)+1}`})
            } else {
                this.$router.push({path: `/score/${this.$route.params.category_id}`})
            }
        }
    },
    mounted() {
        this.getCard();
    },
    watch: {
        "$route.params.question": function(to, from) {
            this.getCard()
        }
    }
};

export default quiz;