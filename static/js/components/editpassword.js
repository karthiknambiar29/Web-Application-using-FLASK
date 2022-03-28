import nav_bar from "./navbar.js";
var edit_password = {
    template: `
        <div class="container form">
            <nav-bar></nav-bar>
            <b-form class="form-signin" @submit="submit">
            <h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Enter New Password</h1>
                <b-form-group>
                    <b-form-input type="password" id="password" v-model="password" placeholder="Enter New Password" required />  
                </b-form-group>
                <b-form-group>
                    <b-form-input type="password" id="confirm_password" v-model="confirm_password" placeholder="Confirm Password" required /> 
                </b-form-group>
                <br>
                <div class="submit-button">
                    <b-button class="submit-button" variant="outline-primary" type="submit">Change Password</b-button>
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
            password: "",
            confirm_password: "", 
        }
    },
    components: {
        'nav-bar': nav_bar,
    },
    methods: {
        submit: function(e) {
            e.preventDefault();
            this.errors = [];
            if (this.password.length <= 5) {
                this.errors.push("Password should have 6 or more characters!!");
            }
            if (this.password != this.confirm_password) {
                this.errors.push("Passwords do not match!!")
            }
            if (!this.errors.length) {
                return this.edit_password();
            } else {
                alert(this.errors.join("\n"))
            }
        },
        async edit_password() {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/user`, {
                    body: JSON.stringify({"password":this.password}),
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
                    this.$router.push({path : `/dashboard`})
                }
            } catch(error) {
                console.log('Error:', error);
            }
        },
    },
}

export default edit_password;