export async function poll({ func, interval = 2000, maxAttempts = 50, checkDone, onProgress }) {
    let attempts = 0;

    return new Promise((resolve, reject) => {
        const polling = async () => {
            attempts++;
            try {
                const result = await func();
                
                if (onProgress && typeof onProgress === 'function') {
                    try {
                        onProgress(result);
                    } catch (progressError) {
                        console.error('onProgress callback error:', progressError);
                    }
                }
                
                if (checkDone(result)) {
                    resolve(result);
                } else if (attempts >= maxAttempts) {
                    reject(new Error("Polling timeout"));
                } else {
                    setTimeout(polling, interval);
                }
            } catch (err) {
                reject(err);
            }
        };

        polling();
    });
}