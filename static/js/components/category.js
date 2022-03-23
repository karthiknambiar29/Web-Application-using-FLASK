var category = {
    data: function() {
        return {
            title: "",
            description: ""
        }
    },
    template: `
        <div>
            <h1>FlashCards</h1>
            <h1>{{ title }}</h1>
            <h2>{{ description }}</h2>
            <b-button class="submit-button" @click="startQuiz" variant="outline-primary">Start Quiz</b-button>
        </div>
    `,
    methods: {
        async getallCard() {
            try {
                const response = await fetch(`http://172.28.134.31:8080/api/allcards/${this.$route.params.category_id}`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const data = await response.json();
                this.data = data
                localStorage.setItem("card_ids", data.card_ids)
                this.description = data.description;
                this.title = data.title;
                console.log(data)

            } catch (error) {
                console.log(error)
            }
        },
        startQuiz() {
            this.$router.push({path:`/quiz/${this.$route.params.category_id}/1`})
        }
    },
    mounted() {
        this.getallCard();
    }
};

export default category;