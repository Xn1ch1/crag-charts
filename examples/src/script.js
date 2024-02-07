window.addEventListener("load", () => {

    const configMenu = document.getElementById('config-menu__toggle-button');

    configMenu.onclick = () => {

        document.body.classList.toggle('--menu-visible', !document.body.classList.contains('--menu-visible'));
        chart._draw();

    }

    const navigationMenu = document.getElementById('navigation-menu');
    const navigationMenuOverlay = document.getElementById('navigation-menu__overlay');

    document.getElementById('navigation-menu__button').onclick = () => {
        navigationMenu.classList.add('--visible');
        navigationMenuOverlay.classList.add('--visible');
    };

    navigationMenuOverlay.onclick = () => {
        navigationMenu.classList.remove('--visible');
        navigationMenuOverlay.classList.remove('--visible');
    };
    navigationMenu.onclick = () => {
        navigationMenu.classList.remove('--visible');
        navigationMenuOverlay.classList.remove('--visible');
    };

});