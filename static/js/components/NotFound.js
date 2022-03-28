var NotFound = {
    template: `
    <div></div>
    `,
    mounted() {
        alert("This page is not found. Click OK to be redirected to dashboard!")
        this.$router.push({path:"/dashboard"})
    }
}

export default NotFound;