$(function () {

    // ------------------------helper function-----------------------------------------

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

    const checkInputLenth = (input, inputName, minLength, maxLength, errorArray) => {
        if (!input) {
            errorArray.push(`Must provide a input at ${inputName}`);
            return;
        }
        if (typeof input != 'string') {
            errorArray.push(`Input type should be string at ${inputName}`);
            return;
        }
        input = input.trim();
        if (input.length < minLength || input.length > maxLength) {
            errorArray.push(`Input length should between ${minLength} - ${maxLength} at ${inputName}`);
            return;
        }
        const regex = /^[^a-zA-Z0-9]+$/;
        if (regex.test(input) === true) {
            errorArray.push(`Input can not be only special characterat ${inputName}`);
            return;
        }
        return;
    }

    // --------------------------Jquery------------------------------------------------

    $(".btn").on("click", (event) => {

        event.preventDefault();
        $('.errorInfo').empty();
        const errorMsg = [];

        const firstname = $("#firstname").val();
        const lastname = $("#lastname").val();
        const old_password = $("#old_password").val();
        const password = $("#password").val();
        const password_again = $("#password_again").val();

        checkInputLenth(firstname, "firstname", 1, 25, errorMsg);
        checkInputLenth(lastname, "lastname", 1, 25, errorMsg);
        // accountValidation(account, errorMsg);
        passwordValidation(password, errorMsg);
        if (password == old_password) errorMsg.push("New password can not be same as old one");
        if (password_again != password) errorMsg.push("The password entered the first and second time does not match");


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
            $('#infoEditForm').trigger("submit");
        }



    })


})