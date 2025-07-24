document.addEventListener('DOMContentLoaded', function() {

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const breakpoint = 850;

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('visible');
        });
    }

    document.querySelectorAll('.categoria').forEach(item => {
        item.addEventListener('click', () => {
            const formId = 'catForm' + item.id.charAt(0).toUpperCase() + item.id.slice(1);
            const form = document.getElementById(formId);
            if (form) {
                form.submit();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > breakpoint) {
            if (mobileNav) {
                mobileNav.classList.remove('visible');
            }
        }
    });

});