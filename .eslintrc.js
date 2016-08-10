module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "globals": {
        "$": false,
        "jQuery": false,
        "process": false,
        "module": true,
        "require": false
    },
    "extends": "eslint:recommended",
    "installedESLint": true,
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "strict": [
            "error",
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "space-before-function-paren": [
            "error",
            { "anonymous": "always", "named": "never" }
        ],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",

        // Disable no-console rule in production
        "no-console": process.env.NODE_ENV !== "production" ? "off" : "error"
    }
};
