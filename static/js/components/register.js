var register_form = {
    template: `
        <div class="container form">
            <b-form class="form-signin" @submit="checkForm">
            <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Register</h1>
                <b-form-group>
                    <b-form-input type="text" id="username" v-model="username" placeholder="Enter Username" required /> 
                </b-form-group>
                <b-form-group>
                    <b-form-input type="password" id="password" v-model="password" placeholder="Enter Password" required />  
                </b-form-group>
                <b-form-group>
                    <b-form-input type="password" id="confirm_password" v-model="confirm_password" placeholder="Confirm Password" required /> 
                </b-form-group>
                <br>
                <div class="submit-button">
                    <b-button class="submit-button" variant="outline-primary" type="submit">Register</b-button>
                </div>
            </b-form>
            <div style="text-align: center; margin-top: 5%;">
                <h6>Already have an account? Sign In!</h6>
                <b-link to="/login"><b-button class="submit-button" variant="outline-primary">Login</b-button></b-link> 
            </div>
        </div>
        `,
    data: function() {
      return {
          username: "",
          password: "",
          confirm_password: "",
          errors: [],
        }
    },
    methods: {
        checkForm: function(e) {
            this.errors = [];
            if (this.username.length <= 5) {
                // alert("Username should have 6 or more characters!!")
                this.errors.push("Username should have 6 or more characters!!");
            } 
            if (this.password.length <= 5) {
                this.errors.push("Password should have 6 or more characters!!");
            } 
            if (this.password != this.confirm_password) {
                this.errors.push("Passwords donot match!!")
            }
            if (!this.errors.length) {
                return this.register();
            } else {
                alert(this.errors.join("\n"))
            }
            e.preventDefault();
        },
        register: function() {
            fetch(`http://172.28.134.31:8080/api/user`, {
                body: JSON.stringify({"name":this.username, "password":this.password}),
                headers: {
                  Accept: "*/*",
                  "Content-Type": "application/json"
                },
                method: "POST",
				})
				.then(response => response.json())
				.then(data => {
					console.log('Success:', data);
                    localStorage.setItem("jwt-token", data.access_token)
				})
				.catch((error) => {
					console.log('Error:', error);
				});
            // console.log(JSON.stringify({name: this.username, password: this.password}))
            this.username = "";
            this.password = "";
            this.confirm_password = "";


        },
    },
}

export default register_form;