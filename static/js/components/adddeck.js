var add_deck = {
    template: `
        <div class="container">
            <b-form @submit="add_deck">
                <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Enter the details of the new deck</h1>
                <b-form-group label="Name of the deck">
                    <b-form-input type="text" id="name" v-model="name" placeholder="Deck Name" required /> 
                </b-form-group>
                <b-form-group label="Description of the Deck">
                    <b-form-input type="text" id="description" v-model="description" placeholder="Description" required /> 
                </b-form-group>
                <br>
                <div class="submit-button">
                    <b-button class="submit-button" variant="outline-primary" type="submit">Submit</b-button>
                </div>            
            </b-form>
        </div>
        `,
    data: function() {
      return {
          name: "",
          description: ""
        }
    },
    methods: {
        async add_deck() {
            try {
                const response = await fetch(`http://172.28.134.31:8080/api/deck`, {
                    body: JSON.stringify({"name":this.name, "description":this.description}),
                    headers: {
                      Accept: "*/*",
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                    method: "POST",
                    })
                if (response.status ==200) {
                    this.$router.push({path : "/decks"})
                }
            } catch(error) {
                console.log('Error:', error);
            }
        },
    },
}

export default add_deck;