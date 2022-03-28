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
                    <b-button id="a2" download="file.csv"v-if="!isDashboard"class="submit-button" @click="download(cat['category_id'])" variant="outline-primary">Download Deck</b-button>

                    <b-button v-if="isDashboard" class="submit-button" @click="startQuiz(cat['category_id'])" variant="outline-primary">Take Quiz</b-button>

                </b-card>
            </div>
            <br>
            <div v-if="!isDashboard" class="text-center">
                <h3 v-if="!isDashboard">Click here to add a new deck!</h3>
                <b-button v-if="!isDashboard" @click="addDeck()" class="submit-button" variant="outline-primary">Add Deck</b-button>
            </div>
            <div style="text-align: center; margin-top: 5%;" v-if="!isDashboard">
                <h6>Click here to go to Dashboard</h6>
                <b-link to="/dashboard"><b-button class="submit-button" variant="outline-primary">Dashboard</b-button></b-link> 
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
        async download(category_id) {
            try{
                const response = await fetch(`http://127.0.0.1:8080/api/download`, {
                    body: JSON.stringify({"category_id":category_id}),
                    headers:{
                        Accept: "*/*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                    method: "POST",
                })

                const data_ = await response.json();
                if (response.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (response.status == 404) {
                    alert(data_.msg)
                    this.$router.go()
                } else {
                    const data = data_.allcards
                    // console.log(data[0].length)
                    const keys = Object.keys(data[0]);
     
                    const commaSeparatedString = [keys.join(",") , data.map(row => keys.map(key => row[key]).join(",")).join("\n")].join("\n")
                    const csvBlob = new Blob([commaSeparatedString])
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(csvBlob);
                    link.setAttribute("download", "file.csv");
                    document.body.appendChild(link);
                    link.click();
                }
                
            } catch (error){
                console.log(error)
            }
        },
        async deleteDeck(category_id) {
            try {
                const res = await fetch(`http://127.0.0.1:8080/api/deck/${category_id}`, {
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
                    this.$router.go()
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getCategory() {
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
                    this.category = data.category;
                }
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