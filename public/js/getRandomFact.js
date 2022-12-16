$(function () {

    const getCatFact = () => {
        const requestConfig = {
            method: 'GET',
            url: 'https://catfact.ninja/fact',
        }

        $.ajax(requestConfig).then((res) => {
            $("#catFact").empty();
            $("#catFact").append(res.fact);
        })
    }

    getCatFact();

    $("#catFact").on("click", (e) => {
        e.preventDefault();
        getCatFact();
    })

})



