$(function () {
    const selector = document.getElementsByClassName('leaflet-control-layers-selector');
    const cats = document.getElementsByClassName('display-Cat');
    const dogs = document.getElementsByClassName('display-Dog'); 
    const others = document.getElementsByClassName('display-Others');
    if (selector.length > 0) {
        selector[0].addEventListener('change', function (ev) {
            if (ev.target.checked) {
                for (let i = 0; i < cats.length; i++) {
                    cats[i].style.display = 'block';
                }
            }
            else {
                for (let i = 0; i < cats.length; i++) {
                    cats[i].style.display = 'none';
                }
            }
        })
        
        selector[1].addEventListener('change', function (ev) {
            if (ev.target.checked) {
                for (let i = 0; i < dogs.length; i++) {
                    dogs[i].style.display = 'block';
                }
            }
            else {
                for (let i = 0; i < dogs.length; i++) {
                    dogs[i].style.display = 'none';
                }
            }
        })

        selector[2].addEventListener('change', function (ev) {
            if (ev.target.checked) {
                for (let i = 0; i < others.length; i++) {
                    others[i].style.display = 'block';
                }
            }
            else {
                for (let i = 0; i < others.length; i++) {
                    others[i].style.display = 'none';
                }
            }
        })
    }
})