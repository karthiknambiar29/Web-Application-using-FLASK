var nav_bar = {
    template: `
    <div>
        <b-navbar toggleable="lg" type="light" variant="light">
            <b-link to="/login" style="text-decoration: none"><b-navbar-brand>Flashcard</b-navbar-brand></b-link>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-navbar-nav class="ms-auto">
                <b-nav-item right><b-link to="/leaderboard" style="text-decoration: none">Leaderboard</b-link></b-nav-item>
                <b-nav-item right><b-link to="/decks" style="text-decoration: none">Decks</b-link></b-nav-item>
                <b-nav-item right><b-link to="/about" style="text-decoration: none">About</b-link></b-nav-item>
                <b-nav-item right><b-link to="/profile" style="text-decoration: none">Profile</b-link></b-nav-item>
                <b-nav-item right><b-link to="/logout" style="text-decoration: none">Sign Out</b-link></b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
`
}

export default nav_bar;