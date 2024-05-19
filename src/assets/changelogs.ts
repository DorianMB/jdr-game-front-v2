const changelog101Alpha = [
    "Ajout du changelog",
    "Ajout de la visualition de la version",
    "Ajout des animations des dégats et des armes pour les combats",
    "Ajustement des niveaux et de l'expérience",
];

export const getChangelog = (version: string) => {
    switch (version) {
        case "1.0.1-alpha":
            return changelog101Alpha;
        default:
            return [];
    }
}