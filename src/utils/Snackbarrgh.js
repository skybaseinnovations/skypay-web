// Import Toastify and its CSS
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export class Snackbarrgh {
	static show(message, { background = "linear-gradient(to right, #00b09b, #96c93d)" } = {}) {
		Toastify({
			text: message,
			duration: 3000,
			close: false,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: background,
			},
		}).showToast();
	}

	static success(message) {
		this.show(message, { background: "#1ec677" });
	}

	static error(message) {
		this.show(message, { background: "#d32929" });
	}

	static info(message) {
		this.show(message, { background: "#1e9fc6" });
	}
}