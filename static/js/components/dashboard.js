var dashboard = {
    template: `
        <div class="container">
            <div style="text-align: center; margin-top: 5%;">
                <h6>{{ username }}</h6>
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
    methods:{
        async protected() {
            const options = {
                method : 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                }
            };
            fetch(`http://172.28.134.31:8080/api/user`, options)
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => {
                console.log('Error:', error)
            })
        }
        
    },
    mounted() {
        this.protected()
    },
    // methods: {
    //     checkForm: function(e) {
    //         this.errors = [];
    //         if (this.username.length <= 5) {
    //             this.errors.push("Username should have 6 or more characters!!");
    //         } 
    //         if (this.password.length <= 5) {
    //             this.errors.push("Password should have 6 or more characters!!");
    //         }
    //         if (!this.errors.length) {
    //             return this.login();
    //         } else {
    //             alert(this.errors.join("\n"))
    //         }
    //         e.preventDefault();
    //     },
    //     async login() {
    //         try {
    //             const response = await fetch(`http://172.28.134.31:8080/api/user`, {
    //                 body: JSON.stringify({"name":this.username, "password":this.password}),
    //                 headers: {
    //                   Accept: "*/*",
    //                   "Content-Type": "application/json"
    //                 },
    //                 method: "POST",
    //                 })
    //             if (response.status == 404) {
    //                 // this.error_username_password = true;
    //                 alert("Username or Password not correct!!")
    //                 this.username = "";
    //                 this.password = "";
    //             } else if (response.status == 200) {
    //                 const data = await response.json();
    //                 console.log("Success:" , data)
                    
    //             }

    //         } catch(error) {
    //             console.log('Error:', error);
    //         }
    //     },
    // },
}

export default dashboard;