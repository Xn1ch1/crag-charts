window.addEventListener("load", () => {

    const configMenu = document.getElementById('config-menu__toggle-button');

    configMenu.onclick = () => {

        document.body.classList.toggle('--menu-visible', !document.body.classList.contains('--menu-visible'));
        chart._draw();

    }

});