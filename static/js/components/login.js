var login_form = {
    template: `
        <div class="container form">
            <b-form class="form-signin" @submit="checkForm">
                <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Login</h1
                <b-form-group>
                    <b-form-input type="text" id="username" v-model="username" placeholder="Enter Username" required /> 
                </b-form-group>
                <b-form-group>
                    <b-form-input type="password" id="password" v-model="password" placeholder="Enter Password" required /> 
                </b-form-group>
                <h6 v-if="error_username_password">Username or Password not correct!!</h6>
                <br>
                <div class="submit-button">
                    <b-button class="submit-button" variant="outline-primary" type="submit">Login</b-button>
                </div>            
            </b-form>
            <div style="text-align: center; margin-top: 5%;">
                <h6>Don't have an account? Register Now!</h6>
                <b-link to="/register"><b-button class="submit-button" variant="outline-primary">Register</b-button></b-link> 
            </div>
        </div>
        `,
    data: function() {
      return {
          username: "",
          password: "",
          errors: [],
          error_username_password: false
        }
    },
    methods: {
        checkForm: function(e) {
            e.preventDefault();
            this.errors = [];
            if (this.username.length <= 5) {
                this.errors.push("Username should have 6 or more characters!!");
            } 
            if (this.password.length <= 5) {
                this.errors.push("Password should have 6 or more characters!!");
            }
            if (!this.errors.length) {
                return this.login();
            } else {
                alert(this.errors.join("\n"))
            }
            
        },
        async login() {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/user`, {
                    body: JSON.stringify({"name":this.username, "password":this.password}),
                    headers: {
                      Accept: "*/*",
                      "Content-Type": "application/json"
                    },
                    method: "POST",
                    })
                if (response.status == 404) {
                    const data = await response.json();
                    alert(data.msg)
                    this.username = "";
                    this.password = "";
                } else if (response.status == 200) {
                    const data = await response.json();
                    localStorage.setItem("jwt-token", data.access_token)
                    this.$router.push({path:"/dashboard"})
                    // console.log("Success:" , data)
                    
                }

            } catch(error) {
                console.log('Error:', error);
            }
        },
    },
}

export default login_form;