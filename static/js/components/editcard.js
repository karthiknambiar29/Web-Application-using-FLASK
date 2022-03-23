var edit_card = {
    template: `
        <div class="container">
            <b-form @submit="submit">
                <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Enter Card Details</h1>
                <b-form-group label="Question">
                    <b-form-input type="text" id="front" v-model="front" :placeholder="front" required /> 
                </b-form-group>
                <br>
                <b-form-group label="Option 1">
                    <b-form-input type="text" id="option_1" v-model="option_1" :placeholder="option_1" required /> 
                </b-form-group>
                <br>
                <b-form-group label="Option 2">
                    <b-form-input type="text" id="option_2" v-model="option_2" :placeholder="option_2" required /> 
                </b-form-group>
                <br>
                <b-form-group label="Option 3">
                    <b-form-input type="text" id="option_3" v-model="option_3" :placeholder="option_3" required /> 
                </b-form-group>
                <br>
                <b-form-group label="Option 4">
                    <b-form-input type="text" id="option_4" v-model="option_4" :placeholder="option_4" required /> 
                </b-form-group>
                <br>
                <b-form-group>
                    <b-form-radio v-model="answer" name="answer1" value="1">Option 1</b-form-radio>
                    <b-form-radio v-model="answer" name="answer1" value="2">Option 2</b-form-radio>
                    <b-form-radio v-model="answer" name="answer1" value="3">Option 3</b-form-radio>
                    <b-form-radio v-model="answer" name="answer1" value="4">Option 4</b-form-radio>

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
            front: "",
            answer: "", 
            option_1: "",
            option_2: "",
            option_3: "",
            option_4: "",
            category_id: "",
        }
    },
    methods: {
        submit: function(e) {
            e.preventDefault();
            return this.edit_card();
        },
        async getCard() {
            try{
                const response = await fetch(`http://172.28.134.31:8080/api/card/${this.$route.params.card_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                },
                method: "GET",
                })
                if (response.status == 200) {
                    const data = await response.json();
                    this.front = data.front;
                    this.answer = data.answer;
                    this.option_1 = data.option_1;
                    this.option_2 = data.option_2;
                    this.option_3 = data.option_3;
                    this.option_4 = data.option_4;
                    this.category_id = data.category_id
                }
            } catch (error) {
                console.log(error)
            }
        },
        async edit_card() {
            try {
                const response = await fetch(`http://172.28.134.31:8080/api/card/${this.$route.params.card_id}`, {
                    body: JSON.stringify({"front":this.front, "answer":this.answer, 
                        "option_1":this.option_1, "option_2":this.option_2, 
                        "option_3":this.option_3, "option_4":this.option_4}),
                    headers: {
                      Accept: "*/*",
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                    method: "PUT",
                })
                if (response.status == 200) {
                    this.$router.push({path : `/cards/${this.category_id}`})
                }
            } catch(error) {
                console.log('Error:', error);
            }
        },
    },
    mounted() {
        this.getCard()
    }
}

export default edit_card;