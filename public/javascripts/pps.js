let points = [];

$(document).ready(() => {
	let canvas = document.getElementById('canvas');
	let context = canvas.getContext("2d");
	let imgFile;

	function drawImage() {
		if (!imgFile) {
			return;
		}

		let img = new Image();
		img.src = URL.createObjectURL(imgFile);
		img.onload = function() {
			context.drawImage(img, 0, 0, 500, 400);
		}
	}

	$('#picImage').on('change', (e) => {
		imgFile = e.target.files[0];
		drawImage();
	});

	canvas.addEventListener('click', (event) => {
		let totalOffsetX = 0;
    let totalOffsetY = 0;
		let currentElement = canvas;
    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)
    canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		points.push({x: canvasX, y: canvasY});

		context.fillStyle = 'red';
		context.strokeStyle = 'red';
		context.beginPath();
		context.arc(canvasX, canvasY, 5, 0, 2*Math.PI, true);
		context.stroke();
	}, false);

	$('#btnClean').on('click', () => {
		drawImage();
		points = [];
	});

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	$('#btnSave').on('click', () => {
		if (!imgFile) {
			return alert('Seleccione una imagen');
		}

		if (points.length < 5) {
			return alert('Seleccione por lo menos 5 puntos en la imagen.');
		}

		let data = {
			points: points,
		};

		getBase64(imgFile)
		.then(b64image => {
			data.image = b64image;

			$.ajax({type: "POST",
				url: window.location.href,
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8"
			}).then(ok => {
				window.location.href = '/';
			}, err => {
				alert(err.responseText);
			});
		});
	});
});