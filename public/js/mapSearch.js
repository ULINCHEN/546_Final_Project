$(function () {

    $("#mapSearch").on("submit", (event) => {

        event.preventDefault();
        console.log("Searched!");

        const requestConfig = {

            // Set Ajax RequestConfig here

        }

        $.ajax(requestConfig).then((res) => {

            // Define how to render response data on page

        })

    })

})