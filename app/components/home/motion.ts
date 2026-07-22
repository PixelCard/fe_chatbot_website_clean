export const smoothEase = [0.22, 1, 0.36, 1] as [
    number,
    number,
    number,
    number,
];

export const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.04,
        },
    },
};

export const fadeUp = {
    hidden: {
        opacity: 0,
        y: 24,
        scale: 0.98,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: smoothEase,
        },
    },
};

export const fadeIn = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: smoothEase,
        },
    },
};

export const cardHover = {
    y: -6,
    transition: {
        duration: 0.25,
        ease: smoothEase,
    },
};