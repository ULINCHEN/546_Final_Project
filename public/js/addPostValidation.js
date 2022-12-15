$(function () {

    // helper function
    const checkInputLenth = (input, inputName, minLength, maxLength, errorArray) => {
        if (!input) {
            errorArray.push(`Must provide a input at ${inputName}`);
            return;
        }
        console.log(typeof input);
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

    // this function use to reset form input after ajax completed
    const formReset = () => {
        $('#animal_name').val("");
        $('#description').val("");
        $('#photo1').val("");
        $('#photo2').val("");
        $('#photo3').val("");
    }

    //---------------------------------------------------------------------------------
    //jquery
    $('#submitBtn').on('click', (event) => {
        event.preventDefault();
        const errorMsg = [];
        $('.errorInfo').empty();
        // check name input, des input
        const nameInput = $('#animal_name').val();
        const descInput = $('#description').val();

        checkInputLenth(nameInput, "Name", 3, 10, errorMsg);
        checkInputLenth(descInput, "Description", 10, 250, errorMsg);
        // check if error exsit
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

            // // if no error, post form data to server use ajax
            // const formData = new FormData(document.getElementById('addAnimalForm'));

            // // ajax setting
            // const ajaxPostConfig = {
            //     method: "POST",
            //     url: "/animal/new",
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     enctype: 'multipart/form-data',
            //     timeout: 5000,
            //     success: () => {
            //         alert("Upload Complete!");
            //     },
            //     error: () => {
            //         alert("Upload Fail, Please Try Again!");
            //     },
            //     complete: () => {
            //         formReset();
            //     },
            // };

            // // fire ajax
            // $.ajax(ajaxPostConfig);
            $("#addAnimalForm").trigger('submit');

        }
    })
});