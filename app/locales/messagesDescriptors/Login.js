const messages = [
    {
        id: "app.login.username",
        defaultMessage: "Username",
        description: "Username input placeholder"
    },
    {
        id: "app.login.password",
        defaultMessage: "Password",
        description: "Password input placeholder"
    },
    {
        id: "app.login.signIn",
        defaultMessage: "Sign in",
        description: "Sign in"
    },
    {
        id: "app.login.endpointInputAriaLabel",
        defaultMessage: "URL of your Ampache instance (e.g. http://ampache.example.com)",
        description: "ARIA label for the endpoint input"
    },
    {
        id: "app.login.rememberMe",
        description: "Remember me checkbox label",
        defaultMessage: "Remember me"
    },
    {
        id: "app.login.greeting",
        description: "Greeting to welcome the user to the app",
        defaultMessage: "Welcome back on Ampache, let's go!"
    },

    // From the auth reducer
    {
        id: "app.login.connecting",
        defaultMessage: "Connecting…",
        description: "Info message while trying to connect"
    },
    {
        id: "app.login.success",
        defaultMessage: "Successfully logged in as { username }!",
        description: "Info message on successful login."
    },
    {
        id: "app.login.byebye",
        defaultMessage: "See you soon!",
        description: "Info message on successful logout"
    }
];

export default messages;
