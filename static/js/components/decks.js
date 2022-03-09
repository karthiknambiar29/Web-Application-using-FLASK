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
                        <b-card-text>Average Score : {{ cat['avg_score'] }}</b-card-text>
                        <b-card-text>Last Attempted : {{ cat['last_score'] }}</b-card-text>
                    </div>
                    <a href="#" class="card-link">Card link</a>
                    <b-link href="#" class="card-link">Another link</b-link>
                </b-card>
            </div>
        </div>
    `,
    methods: {
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
                // console.log(this.isDashboard)
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