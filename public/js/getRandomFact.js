$(function () {

    const requestConfig = {
        method: 'GET',
        url: 'https://catfact.ninja/fact',
    }

    $.ajax(requestConfig).then((res) => {
        $("#catFact").append(res.fact);
    })

})



