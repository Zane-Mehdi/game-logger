export const getLogoByTheme = (theme) => {
    switch (theme) {
        case 'dark':
            return '/game-logger-white.png'
        case 'light':
            return '/game-logger.png'
        default:
            return '/game-logger.png'
    }
}
