process.on('uncaughtException', () => {
    process.exit(1);
});

process.on('unhandledRejection', () => {
    process.exit(1);
})