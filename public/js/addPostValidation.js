$(function () {

    let formReady = true;

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
    // const formReset = () => {
    //     $('#animal_name').val("");
    //     $('#description').val("");
    //     $('#photo1').val("");
    //     $('#photo2').val("");
    //     $('#photo3').val("");
    // }

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
            if (formReady === true) {
                $("#addAnimalForm").trigger('submit');
            }
        }
    })

    const checkFile = (file, errorArr) => {

        if (!file) {
            errorArr.push("No image input");
            return;
        }

        if (file.size >= 16777216) {
            errorArr.push("Image Size should smaller than 16mb ");
            return;
        }

        if (file.type != "image/jpeg" && file.type != "image/png") {
            errorArr.push("Image type should be jpeg or png ");
            return;
        }
        return;
    }


    $("#photo1").on("change", (event) => {
        const errorMsg = [];
        $("#fileError").empty();
        // event.preventDefault();
        const file = event.target.files[0];
        if (!file) {
            formReady = true;
            return;
        }
        console.log(event.target.files[0]);
        checkFile(file, errorMsg);
        if (errorMsg.length > 0) {
            formReady = false;
            for (let msg of errorMsg) {
                const li = document.createElement("li");
                li.append(msg);
                li.style = "color:red";
                $("#fileError").append(li);
            }
        }
        else {
            formReady = true;
        }

    })


});