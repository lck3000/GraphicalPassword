let points = [];

$(document).ready(() => {
	let canvas = document.getElementById('canvas');
	let context = canvas.getContext("2d");
	let elemLeft = canvas.offsetLeft;
	let elemTop = canvas.offsetTop;

	let img = new Image();
	img.src = "/images/horse.jpg";

	function drawHorse() {
		context.drawImage(img, 0, 0, 500, 400);
	}

	img.onload = drawHorse;

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
		drawHorse();
		points = [];
	});

	$('#btnSave').on('click', () => {
		let data = {
			points: points
		};

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