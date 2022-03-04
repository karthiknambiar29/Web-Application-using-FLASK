var login_form = {
    template: `
        <div>
            <h3> Login </h3>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" /> 
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" /> 
                </div>
                <button type="submit">Login</button>
            </form>
            <h3> Messages </h3>
            <ul>
            <li v-for="message in messages"> {{message['username']}} - {{message['password']}}</li>
            </ul>
        </div>
        `,
    data: function() {
      return {
          username: null,
          password: null,
          messages: [],
        }
    },
    methods: {
        login: function() {
            this.messages.push({
                "name": this.username,
                "password": this.password
            });
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


        }
    },
}
async function protected() {
    const options = {
        method : 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
    };
    fetch(`http://172.28.134.31:8080/protected`, options)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.log('Error:', error)
    })
}



