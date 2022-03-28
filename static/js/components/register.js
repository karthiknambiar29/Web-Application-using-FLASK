var register_form = {
    template: `
        <div class="container form">
            <b-form class="form-signin" @submit="checkForm">
            <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Register</h1>
                <b-form-group>
                    <b-form-input type="text" id="username" v-model="username" placeholder="Enter Username" required /> 
                </b-form-group>
                <b-form-group>
                    <b-form-input type="email" id="email" v-model="email" placeholder="Enter E-mail" required /> 
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
          email: "",
          errors: [],
        }
    },
    methods: {
        validEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
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
            if (!this.validEmail(this.email)) {
                this.errors.push('Valid email required.');
            }
            if (!this.errors.length) {
                return this.register();
            } else {
                alert(this.errors.join("\n"))
            }
            e.preventDefault();
        },
        async register() {
            try{
                const response = await fetch(`http://127.0.0.1:8080/api/register`, {
                    body: JSON.stringify({"name":this.username, "password":this.password, "email": this.email}),
                    headers: {
                      Accept: "*/*",
                      "Content-Type": "application/json"
                    },
                    method: "POST",
                })
                if (response.status == 200) {
                    const data = await response.json();
                    localStorage.setItem("jwt-token", data.access_token)
                    this.$router.push({path:"/dashboard"})
                } else if (response.status == 404) {
                    const data = await response.json();
                    alert(data.msg)
                    this.username = ""
                    this.password = ""
                    this.confirm_password = ""
                    this.email = ""

                }
            } catch (error) {
                console.log(error)
            }
        },
    },
}

export default register_form;