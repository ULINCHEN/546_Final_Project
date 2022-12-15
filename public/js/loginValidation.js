$(function () {


    // helper function

    const accountValidation = (username, errorArray) => {
        if (!username) {
            errorArray.push("Please provide a username");
            return;
        }
        if (typeof username != 'string') {
            errorArray.push("username type should be string");
            return;
        }
        username = username.trim().toLowerCase();
        if (username.length < 4) {
            errorArray.push('username length should be at least 4 character');
            return;
        }

        // check if string contains space
        const space = /\s/;
        if (space.test(username) == true) {
            errorArray.push('username should not contains space');
            return;
        }

        // check if string is only number
        const num = /^\d+$/;
        if (num.test(username) == true) {
            errorArray.push(`username should not be only digits`);
            return;
        }
        return;
    }

    const passwordValidation = (password, errorArray) => {
        if (!password) {
            errorArray.push("Please provide a password");
            return;
        }
        if (typeof password != 'string') {
            errorArray.push("Password should be a string");
            return;
        }
        password = password.trim();
        if (password.length < 6) {
            errorArray.push("Password should be at least 6 character, or can not be full of space");
            return;
        }
        // check if string contains space
        const space = /\s/;
        if (space.test(password) == true) {
            errorArray.push('Password should not contains space');
            return;
        }
        return;
    }


    // jquery

    $('.btn').on('click', (event) => {
        event.preventDefault();
        const errorMsg = [];
        $('.errorInfo').empty();

        const username = $('#inputAccount').val();
        const password = $('#inputPassword').val();
        accountValidation(username, errorMsg);
        passwordValidation(password, errorMsg);

        if (errorMsg.length > 0) {
            $('.errorInfo').append("<h5>Error</h5>");
            // $('#error').removeAttr(hidden);
            for (let msg of errorMsg) {
                let li = document.createElement('li');
                li.innerHTML = msg;
                $('.errorInfo').append(li);
            }
        }
        else {

            $('#loginForm').trigger("submit");

        }

    })

})