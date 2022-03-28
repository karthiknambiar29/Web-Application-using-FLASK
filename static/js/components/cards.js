import nav_bar from "./navbar.js";
var cards = {
    data: function() {
        return {
            cards: {},
            title: "",
        }
            
    },
    components: {
        'nav-bar': nav_bar,
    },
    template: `
    <div>
    <nav-bar></nav-bar>
    <h1> Cards : {{title}} </h1>
        <div v-for="card in cards">
            <b-card :header="card['front']" border-variant="primary"
            header-bg-variant="primary"
            header-text-variant="white"
            align="center">
            <b-card-body>
                <b-table :items="card['options']" thead-class="d-none" borderless />
            </b-card-body>
            <b-button @click="editCard(card['card_id'])" class="submit-button" variant="outline-primary">Edit Card</b-button>
            <b-button @click="deleteCard(card['card_id'])" class="submit-button" variant="outline-primary">Delete Card</b-button>
            </b-card>
            <br>
        </div>
    </div>
    `,
    methods: {
        editCard(card_id) {
            this.$router.push({path: `/editcard/${card_id}`})
        },
        async deleteCard(card_id) {
            try{
                const response = await fetch(`http://127.0.0.1:8080/api/card/${parseInt(card_id)}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                if (response.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (response.status == 200) {
                    this.$router.go()
                }
            } catch (error) {

            }
        },
        async getCards() {
            try{
                const res = await fetch(`http://127.0.0.1:8080/api/allcards/${this.$route.params.category_id}`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const result = await res.json();
                this.title = result.title;
                if (res.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (res.status == 200) {
                    try{
                        const res_ = await fetch(`http://127.0.0.1:8080/api/allcards`, {
                            body: JSON.stringify({"answers": null, "card_ids":null, "category_id":this.$route.params.category_id}),
                            headers:{
                                Accept: "*/*",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                            },
                            method: "POST",
                        })
        
                        const data = await res_.json();
                        if (res_.status == 401) {
                            alert("Session Expired!")
                            this.$router.push({path:"/login"})
                        } else if (res_.status == 200) {
                            if (Object.keys(data).length == 0) {
                                alert("No cards in the deck!")
                                this.$router.push({path:"/decks"})
                            }
                            for (let [key, value] of Object.entries(data)) {
                                let options = []
                                options.push({"1":"1. " + value.option_1})
                                options.push({"1":"2. " + value.option_2})
                                options.push({"1":"3. " + value.option_3})
                                options.push({"1":"4. " + value.option_4})
                                options[value.correct_ans-1]["_rowVariant"] = "success"
                                value.options = options
                            }
                            this.cards = data
                        }
                        
                    } catch (error){
                        console.log(error)
                    }
                } else {
                    alert("Invalid Category!\nRedirecting to dashboard");
                    this.$router.push({path: "/dashboard"})
                }
            } catch (error){
                console.log(error)
            }
            
        }
    },
    mounted() {
        this.getCards();
    },
    watch: {
        "$route.params.category_id": function(to, from) {
            this.getCards()
        }
    }
    // updated() {
    //     this.getCards();
    // }
}

export default cards;