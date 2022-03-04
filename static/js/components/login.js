var login_form = {
    template: `
        <div>
            <h3> Login </h3>
            <b-form @submit="login">
                <b-form-group>
                    <b-form-input type="text" id="username" v-model="username" /> 
                </b-form-group>
                <b-form-group>
                    <b-form-input type="password" id="password" v-model="password" /> 
                </b-form-group>
                <b-button type="submit">Login</b-button>
            </b-form>
        </div>
        `,
    data: function() {
      return {
          username: "",
          password: "",
          errors: [],
        }
    },
    methods: {
        checkFrom: function(e) {
            this.errors = [];
            if (this.username.length <= 5) {
                this.errors.push("Username should have 6 or more characters!!");
            } 
            if (this.password.length <= 5) {
                this.errors.push("Password should have 6 or more characters!!");
            }
            if (!this.errors.length) {
                return this.login();
            }
            e.preventDefault();
        },
        login: function() {
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


        },
    },
}

export default login_form;