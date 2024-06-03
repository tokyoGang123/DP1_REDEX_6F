let timerId = null;

onmessage = function (e) {
  const { action, interval } = e.data;

  if (action === 'start') {
    let startTime = Date.now(); // Inicializa el tiempo de inicio cada vez que se inicia el cronómetro
    timerId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      postMessage(elapsedTime);
    }, interval);
  } else if (action === 'stop') {
    clearInterval(timerId);
    timerId = null;
  }
};
