import nav_bar from "./navbar.js";
var edit_deck = {
    template: `
        <div class="container">
        <nav-bar></nav-bar>

            <b-form @submit="submit">
                <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Enter details</h1>
                <b-form-group label="Name of the deck">
                    <b-form-input type="text" id="name" v-model="name" :placeholder="name" required /> 
                </b-form-group>
                <b-form-group label="Description of the Deck">
                    <b-form-input type="text" id="description" v-model="description" :placeholder="description" required /> 
                </b-form-group>
                <br>
                <div class="submit-button">
                    <b-button class="submit-button" variant="outline-primary" type="submit">Submit</b-button>
                </div>            
            </b-form>
            <div style="text-align: center; margin-top: 5%;">
                <h6>Click here to go to Dashboard</h6>
                <b-link to="/dashboard"><b-button class="submit-button" variant="outline-primary">Dashboard</b-button></b-link> 
            </div>
        </div>
        `,
    data: function() {
      return {
          name: "",
          description: ""
        }
    },
    components: {
        'nav-bar': nav_bar,
    },
    methods: {
        submit: function(e) {
            e.preventDefault();
            return this.edit_deck();
        },
        async getDeck() {
            try{
                const response = await fetch(`http://127.0.0.1:8080/api/deck/${this.$route.params.category_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                },
                method: "GET",
                })
                if (response.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (response.status == 200) {
                    const data = await response.json();
                    this.name = data.name;
                    this.description = data.description;
                }
            } catch (error) {
                console.log(error)
            }
        },
        async edit_deck() {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/deck/${this.$route.params.category_id}`, {
                    body: JSON.stringify({"name":this.name, "description":this.description}),
                    headers: {
                      Accept: "*/*",
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                    method: "PUT",
                })
                if (response.status == 401) {
                    alert("Session Expired!")
                    this.$router.push({path:"/login"})
                } else if (response.status == 200) {
                    this.$router.push({path : "/decks"})
                }
            } catch(error) {
                console.log('Error:', error);
            }
        },
    },
    mounted() {
        this.getDeck()
    }
}

export default edit_deck;