$(function () {
    const selector = document.getElementsByClassName('leaflet-control-layers-selector');
    const cats = document.getElementsByClassName('display-cat');
    const dogs = document.getElementsByClassName('display-dog'); 
    const others = document.getElementsByClassName('display-other');
    if (selector.length > 0) {

        selector[0].addEventListener('change', function (ev) {
            if (ev.target.checked) {
                cats[0].style.display = 'block';
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
    }
})