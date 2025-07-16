document.addEventListener('DOMContentLoaded', () => {

    // --- Carrousel des images d'arrière-plan de la section Héro ---
    const backgroundCarousel = document.querySelector('.background-carousel');
    if (backgroundCarousel) {
        const carouselImages = backgroundCarousel.querySelectorAll('.carousel-img');
        let currentImageIndex = 0;

        function showNextBackgroundImage() {
            if (carouselImages.length === 0) return; // Ne rien faire s'il n'y a pas d'images

            // Retire la classe 'active' de l'image actuelle
            if (carouselImages[currentImageIndex]) {
                carouselImages[currentImageIndex].classList.remove('active');
            }

            // Passe à l'image suivante, ou revient au début si on est à la fin
            currentImageIndex = (currentImageIndex + 1) % carouselImages.length;

            // Ajoute la classe 'active' à la nouvelle image
            if (carouselImages[currentImageIndex]) {
                carouselImages[currentImageIndex].classList.add('active');
            }
        }

        // S'assurer qu'il y a des images avant de lancer le carrousel
        if (carouselImages.length > 0) {
            // Active la première image au chargement (au cas où elle n'est pas déjà 'active' dans le HTML)
            carouselImages[0].classList.add('active');
            // Lance le défilement automatique toutes les 5 secondes (5000 millisecondes)
            setInterval(showNextBackgroundImage, 5000);
        }
    }

    // --- Carrousel de la section "Notre Équipe" ---
    const teamCarouselTrack = document.querySelector('.team-carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (teamCarouselTrack && prevButton && nextButton) {
        let currentMemberDisplayIndex = 0; // Index pour savoir quel membre est le premier visible
        const members = teamCarouselTrack.querySelectorAll('.team-member');
        const totalMembers = members.length;

        if (totalMembers === 0) return; // Ne rien faire s'il n'y a pas de membres

        // Calculer la largeur exacte d'un membre, y compris son gap droit (30px comme dans le CSS)
        const memberComputedStyle = window.getComputedStyle(members[0]);
        // Assurez-vous que le 'gap' est bien pris en compte, souvent c'est le 'margin-right' ou via CSS gap
        const memberFullWidth = members[0].offsetWidth + 30; // 30px pour le gap

        // Fonction pour mettre à jour la position du carrousel
        function updateTeamCarousel() {
            teamCarouselTrack.style.transform = `translateX(${-currentMemberDisplayIndex * memberFullWidth}px)`;
        }

        // --- Défilement automatique pour l'équipe (un membre à la fois) ---
        let autoScrollTeamInterval;
        const startTeamAutoScroll = () => {
            stopTeamAutoScroll(); // S'assurer qu'il n'y a qu'un seul intervalle actif
            autoScrollTeamInterval = setInterval(() => {
                // Défilement infini: si on arrive à la fin, on revient au début
                currentMemberDisplayIndex = (currentMemberDisplayIndex + 1) % totalMembers;
                updateTeamCarousel();
            }, 3000); // Défile un membre toutes les 3 secondes (ajustez ce temps)
        };

        const stopTeamAutoScroll = () => {
            clearInterval(autoScrollTeamInterval);
        };

        // --- Navigation manuelle par les flèches ---
        prevButton.addEventListener('click', () => {
            stopTeamAutoScroll(); // Arrête le défilement automatique lors de l'interaction manuelle
            currentMemberDisplayIndex = (currentMemberDisplayIndex - 1 + totalMembers) % totalMembers;
            updateTeamCarousel();
            startTeamAutoScroll(); // Redémarre l'auto-scroll après un court délai
        });

        nextButton.addEventListener('click', () => {
            stopTeamAutoScroll(); // Arrête le défilement automatique
            currentMemberDisplayIndex = (currentMemberDisplayIndex + 1) % totalMembers;
            updateTeamCarousel();
            startTeamAutoScroll(); // Redémarre l'auto-scroll après un court délai
        });

        // Initialisation: Lancer le défilement automatique au chargement
        startTeamAutoScroll();

        // Pause/Reprise au survol (optionnel, mais recommandé pour l'UX)
        teamCarouselTrack.parentElement.addEventListener('mouseenter', stopTeamAutoScroll);
        teamCarouselTrack.parentElement.addEventListener('mouseleave', startTeamAutoScroll);

        // Ajuster au redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            // Réinitialise l'index et la position pour s'adapter à la nouvelle largeur d'écran
            currentMemberDisplayIndex = 0;
            updateTeamCarousel();
            stopTeamAutoScroll();
            startTeamAutoScroll();
        });
    }

    // --- Fonctionnalités pour le formulaire d'inscription (validation) ---
    const registrationForm = document.querySelector('.registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let isValid = true;
            const formGroups = this.querySelectorAll('.form-group');

            formGroups.forEach(group => {
                group.classList.remove('error');
                const errorMessage = group.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            });

            const requiredInputs = this.querySelectorAll('input[required]');
            requiredInputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    const formGroup = input.closest('.form-group');
                    formGroup.classList.add('error');
                    let errorMessage = formGroup.querySelector('.error-message');
                    if (!errorMessage) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        formGroup.appendChild(errorMessage);
                    }
                    errorMessage.textContent = 'Ce champ est obligatoire.';
                }
            });

            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
                isValid = false;
                const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
                confirmPasswordGroup.classList.add('error');
                let errorMessage = confirmPasswordGroup.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.classList.add('error-message');
                    confirmPasswordGroup.appendChild(errorMessage);
                }
                errorMessage.textContent = 'Les mots de passe ne correspondent pas.';
            }

            if (isValid) {
                alert('Formulaire soumis avec succès ! (Ceci est une simulation)');
                this.reset();
            } else {
                const firstErrorField = document.querySelector('.form-group.error input');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorField.focus();
                }
            }
        });
    }

    // --- Menu de navigation responsive (Hamburger) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

}); // Fin de DOMContentLoaded