const home_page = {
    template: `
    <div class="container" style="width: 100%; vertical-align: middle; padding-top: 10%;">
        <div>
            <h1 class="h1 mb-3 font-weight-normal" style="text-align: center;">Welcome to Flashcards</h1>
        </div>
        <br>
        <div style="text-align: center; margin-top: 5%;">
            <h6>Already have an account? Sign In!</h6>
            <b-link to="/login"><button id="login" class="btn btn-primary" value="Register">Sign In</button></b-link>
         </div>
        <br>
        <div style="text-align: center; margin-top: 5%;">
            <h6>Don't have an account? Register Now!</h6>
            <b-link to="/register"><button id="register" class="btn btn-primary" value="Register">Register Now</button></b-link>
        </div>
    </div>
    `
};

export default home_page;