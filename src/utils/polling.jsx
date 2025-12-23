export async function poll({ func, interval = 3000, maxAttempts = 10, checkDone }) {
    let attempts = 0;

    return new Promise((resolve, reject) => {
        const polling = async () => {
            attempts++;
            try {
                const result = await func();
                if (checkDone(result)) {
                    resolve(result)
                } else if (attempts > maxAttempts) {
                    reject(new Error("Polling timeout"))
                } else {
                    setTimeout(polling, interval)
                }
            } catch (err) {
                reject (err)
            }
        };

        polling();
    })
}