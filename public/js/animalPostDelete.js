$(function () {

    const deleteAjax = (id) => {

        let url = "/detail/" + id;

        const requestConfig = {
            method: 'DELETE',
            url: url,
        }

        $.ajax(requestConfig);

    }



    $(".animalPostDelete").on("click", (event) => {

        event.preventDefault();

        let id = $(this).id;

        console.log(id);

    })

})