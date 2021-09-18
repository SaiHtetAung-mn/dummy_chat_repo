process.on('uncaughtException', () => {
    process.exit(0);
});

process.on('unhandledRejection', () => {
    process.exit(0);
})