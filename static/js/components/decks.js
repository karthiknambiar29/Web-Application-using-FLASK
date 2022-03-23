import nav_bar from "./navbar.js";
var decks = {
    props: {
        isDashboard: Boolean,
    },
    data: function() {
        return {
            category: [],
        }
    },
    components: {
        'nav-bar': nav_bar
    },
    template: `
        <div class="container">
            <div v-if="!isDashboard">
                <nav-bar></nav-bar>
            </div>
            <h2 style="text-align: left; margin-top: 5%;">Flashcard Decks</h2>
            <div style="text-align: center; margin-top: 5%;" v-for="cat in category">
                <b-card :title="cat['name']" :sub-title="cat['description']" border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center">
                    <div v-if="cat['avg_score']==null">
                        <b-card-text>
                        Not yet attempted!!
                        </b-card-text>
                    </div>
                    <div v-else>
                        <b-card-text>Average Score : {{ cat['avg_score'] }}%</b-card-text>
                        <b-card-text>Last Attempted : {{ cat['last_score'] }}</b-card-text>
                    </div>
                    <br>
                    <b-button v-if="!isDashboard" @click="showCards(cat['category_id'])" class="submit-button" variant="outline-primary">Show Cards</b-button>
                    <b-button v-if="!isDashboard"class="submit-button" @click="addCard(cat['category_id'])" variant="outline-primary">Add Cards</b-button>
                    <b-button v-if="!isDashboard"class="submit-button" @click="editDeck(cat['category_id'])" variant="outline-primary">Edit Deck</b-button>
                    <b-button v-if="!isDashboard"class="submit-button" @click="deleteDeck(cat['category_id'])" variant="outline-primary">Delete Deck</b-button>

                    <b-button v-if="isDashboard" class="submit-button" @click="startQuiz(cat['category_id'])" variant="outline-primary">Take Quiz</b-button>

                </b-card>
            </div>
            <br>
            <div class="text-center">
                <h3>Click here to add a new deck!</h3>
                <b-button v-if="!isDashboard" @click="addDeck()" class="submit-button" variant="outline-primary">Add Deck</b-button>
            </div>
        </div>
    `,
    methods: {
        showCards(category_id) {
            this.$router.push({path: `/cards/${category_id}`})
        },
        startQuiz(category_id) {
            this.$router.push({path: `/start/${category_id}`})
        },
        addCard(category_id) {
            this.$router.push({path: `/addcard/${category_id}`})
        },
        addDeck() {
            this.$router.push({path: "/adddeck"})
        },
        editDeck(category_id) {
            this.$router.push({path: `/editdeck/${category_id}`})
        },
        async deleteDeck(category_id) {
            try {
                const res = await fetch(`http://172.28.134.31:8080/api/deck/${category_id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                if (res.status == 200) {
                    this.$router.go()
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getCategory() {
            try {
                const response = await fetch(`http://172.28.134.31:8080/api/user`, {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    }
                })
                const data = await response.json();
                this.category = data.category;
                console.log(this.category)
            } catch(error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.getCategory();
    }
};

export default decks;