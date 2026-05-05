let globalWaitListPopupData = '';
let submittedUserEmail = null;

document.addEventListener('DOMContentLoaded', function () {
	var buttons = document.querySelectorAll('section.cta .cta__button-wrapper > a');
	buttons.forEach(function(button) {
		if (button.getAttribute('href') === 'https://ubverse.unboundx.co/for-founders') {
		  	button.classList.remove('js-popup-open');
	  	}
	});
});

document.querySelectorAll('.toggle_headings').forEach(toggle => {
	toggle.addEventListener('click', () => {
		const messageElements = document.querySelectorAll('.popup_form_message');
		messageElements.forEach(messageEl => {
			messageEl.textContent = '';
			messageEl.style.display = 'none';
			messageEl.classList.remove('success-message', 'fail-message');
		});

		const notJoined = document.querySelector('.popup__form_heading.not-joined');
		const alreadyJoined = document.querySelector('.popup__form_heading.already-joined');
		const submitBtns = document.querySelectorAll('.join-form .submit_data');
		const emailInputs = document.querySelectorAll('.join-form #user_email');
		const join_popup_title = document.querySelector('#join-popup .popup__intro_title');
		const popup_column_join = document.querySelector('#join-popup .popup_column');
		const isNotJoinedVisible = notJoined.style.display === 'block' || notJoined.style.display === '';

		if (isNotJoinedVisible) {
			notJoined.style.display = 'none';
			alreadyJoined.style.display = 'block';
			join_popup_title.style.display = 'none';
			if (window.innerWidth >= 1050 && window.innerWidth <= 1450) {
				popup_column_join.style.flexDirection  = 'unset';
			}
			var submitBtns_txt = 'Continue';
			document.querySelector('#join-popup .main-popup-column .popup_column')?.classList.add('signup-now');
			var user_type = 'view_details';
		} else {
			document.querySelector('#join-popup .main-popup-column .popup_column')?.classList.remove('signup-now');
			var submitBtns_txt = 'Join the Beta Waitlist';
			join_popup_title.style.display = 'block';
			if (window.innerWidth >= 1050 && window.innerWidth <= 1450) {
				popup_column_join.style.flexDirection  = 'column';
			}
			notJoined.style.display = 'block';
			alreadyJoined.style.display = 'none';
			var user_type = 'join_us';
		}
		emailInputs.forEach(input => {
			input.setAttribute('user_type', user_type);
		});
		submitBtns.forEach(btn => {
			btn.value = submitBtns_txt
		});
	});
});

const phoneInput = document.getElementById('user_phonenumber');
if(phoneInput) {
phoneInput.addEventListener('input', function () {
	let input = this.value.replace(/\D/g, '');
	if (input.length > 10) {
		input = input.slice(0, 10);
	}
	let formatted = '';
	if (input.length > 6) {
		formatted = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6)}`;
	} else if (input.length > 3) {
		formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
	} else {
		formatted = input;
	}
	this.value = formatted;
});
}

document.querySelector('.refer-code-copy').addEventListener('click', function () {
	const referCodeElement = document.getElementById('refer-code');
	const range = document.createRange();
	range.selectNodeContents(referCodeElement);
	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	try {
		document.execCommand('copy');
		//alert('Referral code copied to clipboard!');
	} catch (err) {
		console.error('Failed to copy: ', err);
	}

	selection.removeAllRanges();
});

function submit_data(button) {
	const actionType = button.getAttribute('action_type');

	if (actionType === 'join_us') {
		var user_email = document.querySelector('#join-us-form #user_email').value.trim();
	} else {
		var user_email = document.querySelector('#view-rank-form #user_email').value.trim();
	}

	var urlParams = new URLSearchParams(window.location.search);
	var referralCode = urlParams.get('referral_code');
	var isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email);

	const messageElements = document.querySelectorAll('.popup_form_message');
	messageElements.forEach(el => {
		el.textContent = '';
		el.style.display = 'none';
		el.classList.remove('success-message', 'fail-message');
	});

	if (user_email === '') {
		messageElements.forEach(el => {
			el.textContent = 'Email address is required.';
			el.classList.add('fail-message');
			el.style.display = 'block';
		});
		return;
	}
	if (!isValidEmail) {
		messageElements.forEach(el => {
			el.textContent = 'Invalid email address.';
			el.classList.add('fail-message');
			el.style.display = 'block';
		});
		return;
	}

	// email set globally
	submittedUserEmail = user_email;

	const formData = new URLSearchParams({
		action: 'join_us_view_waitlist',
		email: user_email,
		user_type: actionType,
		referralCode: referralCode
	});

	if (actionType === 'join_us') {
		const user_name = document.getElementById('user_name').value.trim();
		const user_phonenumber = document.getElementById('user_phonenumber').value.trim();

		if (user_name === '') {
			messageElements.forEach(el => {
				el.textContent = 'Name is required.';
				el.classList.add('fail-message');
				el.style.display = 'block';
			});
			return;
		}

		// if (user_phonenumber === '') {
		// 	messageElements.forEach(el => {
		// 		el.textContent = 'Phone number is required.';
		// 		el.classList.add('fail-message');
		// 		el.style.display = 'block';
		// 	});
		// 	return;
		// }
		formData.append('user_name', user_name);
		formData.append('user_phonenumber', user_phonenumber);
	}
	// alert(my_ajax_object.ajax_url);
	fetch(my_ajax_object.ajax_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formData
	})
		.then(response => response.json())
		.then(data => {
			console.log('checking fetch',data);
			
			if (data.success) {
				messageElements.forEach(el => {
					el.textContent = data.data.message
					el.classList.add('success-message');
					el.style.display = 'block';
				});
				globalWaitListPopupData = data;
				openWaitListPopup(data);
			} else {
				messageElements.forEach(el => {
					el.textContent = data.data.message || "Something went wrong Else";
					el.classList.add('fail-message');
					el.style.display = 'block';
				});
				globalWaitListPopupData = data;
				openWaitListPopup(data);
			}
		})
		.catch(error => {
			messageElements.forEach(el => {
				el.textContent = error.message || 'Request failed. Please try again.';
				el.classList.add('fail-message');
				el.style.display = 'block';
			});
		});

}

function backReferral() {
	if (globalWaitListPopupData != '') {
		openWaitListPopup(globalWaitListPopupData);
	}

}
function openWinnerPopup() {
	document.querySelector('#join-popup .popup__close').click();
	document.querySelector('#waitlist-popup .popup__close').click();
	document.querySelector('#winner-popup').classList.add('is-open');
	document.body.classList.add("has-popup-open");
	// fetch(my_ajax_object.ajax_url, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/x-www-form-urlencoded'
	// 	},
	// 	body: new URLSearchParams({
	// 		action: 'get_winner_list',
	// 	})
	// })
	// .then(response => response.json())
	// .then(data => {
	// 	const tbody = $('#get-winner-list tbody');
	// 	tbody.empty();
	// 	if(data.success) {
	// 		var tableData = data.data.tableData;
	// 		tableData.forEach(row => {
	// 			const tr = `<tr>
	// 				<td>${row.tier}</td>
	// 				<td>${row.rank}</td>
	// 				<td>${row.name}</td>
	// 				<td>${row.prize}</td>
	// 			</tr>`;
	// 			tbody.append(tr);
	// 		});
	// 	}
	// })
	// .catch(error => {
	// 	console.error('Error:', error);
	// });
}
// function getTierPosition(tier, value, device_type) {
// 	if(device_type == 'mobile'){
// 		value = Math.max(0, Math.min(100, value));
// 		let percent;
// 		if (tier === 'Tier-1') {
// 			percent = ((value / 100) * 67 - 7) + '%';  // -7% to 60%
// 		} else if (tier === 'Tier-2') {
// 			percent = ((value / 100) * 68 - 6) + '%';  // -6% to 62%
// 		} else if (tier === 'Tier-3') {
// 			percent = ((value / 100) * 67 - 6) + '%';  // -6% to 61%
// 		} else if (tier === 'Tier-4') {
// 			percent = ((value / 100) * 72 - 9) + '%';  // -9% to 63%
// 		}
// 		return percent;
// 	} else{
// 		value = Math.max(0, Math.min(100, value));
// 		let percent;
// 		if (tier === 'Tier-1') {
// 			percent = ((value / 100) * 71 - 30) + '%'; // -30% to 41%
// 		} else if (tier === 'Tier-2') {
// 			percent = ((value / 100) * 79 - 20) + '%'; // -20% to 59%
// 		} else if (tier === 'Tier-3') {
// 			percent = ((value / 100) * 86 - 12) + '%'; // -12% to 74%
// 		} else if (tier === 'Tier-4') {
// 			percent = ((value / 100) * 90 - 9) + '%';  // -9% to 81%
// 		}
// 		return percent;
// 	}
// }

function openWaitListPopup(popupData) {
	const firstTab = document.querySelector('#waitlist-popup .tab-link[onclick*="referrals-tab"]');
	console.log('nilesh',firstTab);
	if (firstTab) {
		referralLeaderboardTabSwitch({ currentTarget: firstTab }, 'referrals-tab');
	}
	document.querySelectorAll('.popup-wrapper.is-open .popup').forEach(popup => {
		popup.scrollTo({ top: 0, behavior: 'smooth' });
	});
	document.querySelector('#join-popup .popup__close').click();
	document.querySelector('#waitlist-popup').classList.add('is-open');
	document.body.classList.add("has-popup-open");
	document.querySelector('#waitlist-popup #refer-code').textContent = popupData.data.referral_url;

	document.querySelector(".current-tire-label").innerHTML = "(" + popupData.data.tier + ")";
	var inputPercent = popupData.data.percentile;
	var icon_position = (inputPercent / 100) * 99;
	if (icon_position != 0) {
		icon_position = icon_position - 0.5;
	}
	document.querySelector(".current-position-icon").style.left = icon_position + '%';
	var device_type = popupData.data.device_type;
	if (device_type == 'mobile') {
		var currentPosition = (inputPercent / 100) * 74;
		document.querySelector(".current-positions").style.left = currentPosition + '%';
	} else {
		var currentPosition = (inputPercent / 100) * 75;
		document.querySelector(".current-positions").style.left = currentPosition + '%';
	}

	document.querySelector("#progress_labels_count").innerHTML = popupData.data.count;
	document.querySelector("#drow_end").innerHTML = popupData.data.drow_end;
	document.querySelector("#next_drow").innerHTML = popupData.data.next_drow;
	document.querySelector(".progress-fill").style.width = popupData.data.percentile + '%';
	document.querySelector(".referral-footer").innerHTML = popupData.data.nextMilesStone;
	document.querySelector(".total-referral-count").innerHTML = popupData.data.count;
	document.querySelector(".total-xp-count").innerHTML = popupData.data.xp;
}

document.addEventListener("DOMContentLoaded", function () {
	const platformUrls = {
		instagram: "https://www.instagram.com/",
		reddit: "https://www.reddit.com/submit?url=",
		discord: "https://discord.com/app",
		linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=",
		facebook: "https://www.facebook.com/sharer/sharer.php?u=",
		twitter: "https://twitter.com/intent/tweet?text=",
		email: "mailto:?subject=You’re Invited: Get on the UnBound X Waitlist Early 🚀&body="
	};
	// handles the messages for the different social medias
	const platformMessages = {
		// for 'X' link
		twitter: (url) => `
			Just joined the waitlist for UnBound X — a new platform reimagining how we connect, share, and invest.
			Spots are limited — get in early:
			👉 ${url}
			🔗 unboundx.co
			📱 @unboundxapp`.trim(),
		email: (url) => `
			I just joined the waitlist for UnBound X — a new platform that's reimagining how we connect, share, and invest. It fuses community, insights, and investing in a way I haven’t seen before.
			By joining early, you can:
			✅ Earn rewards & XP
			🏆 Climb the leaderboard
			🎉 Get exclusive access to the beta launch event
			Spots are limited, so if you're curious, jump in soon:
			👉 Join with my link: ${url}
			`.trim()
	};
	document.querySelectorAll(".share-to-social-media").forEach(img => {
		img.addEventListener("click", function () {
			const span = this.closest("span[social-item]");
			if (!span) return;
			const platform = span.getAttribute("social-item").toLowerCase();
			const referCodeEl = document.getElementById("refer-code");
			if (!referCodeEl) return;
			const rawText = referCodeEl.textContent.trim();
			const referralUrl = rawText.replace(/[()]/g, '');
			navigator.clipboard.writeText(referralUrl).catch(() => {
				console.warn("Clipboard copy failed");
			});
			let baseUrl = platformUrls[platform];
			if (!baseUrl) return;
			if (["instagram", "discord"].includes(platform)) {
				window.open(baseUrl, "_blank");
			} else if (platform === "linkedin") {
				// LinkedIn doesn't support custom text — just share the URL
				window.open(baseUrl + encodeURIComponent(referralUrl), "_blank");
			} else if (platformMessages[platform]) {
				// Platforms like Twitter or Email that support text
				const message = platformMessages[platform](referralUrl);
				window.open(baseUrl + encodeURIComponent(message), "_blank");
			} else {
				// Fallback for platforms like Facebook, Reddit
				window.open(baseUrl + encodeURIComponent(referralUrl), "_blank");
			}
		});
	});
});


document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".js-popup-open").forEach(function (el) {
		el.addEventListener("click", function () {
			const messageElements = document.querySelectorAll('.popup_form_message');
			messageElements.forEach(messageEl => {
				messageEl.textContent = '';
				messageEl.style.display = 'none';
				messageEl.classList.remove('success-message', 'fail-message');
			});
			const emailInput1 = document.querySelector(".join-form#view-rank-form #user_email");
			if (emailInput1) {
				emailInput1.value = "";
			}
			const emailInput2 = document.querySelector(".join-form#join-us-form #user_email");
			if (emailInput2) {
				emailInput2.value = "";
			}
			const user_name = document.querySelector(".join-form#join-us-form #user_name");
			if (user_name) {
				user_name.value = "";
			}
			const user_phonenumber = document.querySelector(".join-form#join-us-form #user_phonenumber");
			if (user_phonenumber) {
				user_phonenumber.value = "";
			}
			const joinPopup = document.getElementById('join-popup');
			joinPopup.querySelector('.popup__form_heading.not-joined').style.display = 'block';
			joinPopup.querySelector('.popup__form_heading.already-joined').style.display = 'none';

			const join_popup_title = document.querySelector('#join-popup .popup__intro_title');
			join_popup_title.style.display = 'block';
		});
	});
});


function winnerPopupTabChange(evt, tabId) {
	document.querySelectorAll('.popup-wrapper.is-open .popup').forEach(popup => {
		popup.scrollTo({ top: 0, behavior: 'smooth' });
	});
	const popup = document.getElementById('winner-popup');
	const tabContents = popup.querySelectorAll('.tab-content');

	tabContents.forEach(tab => tab.classList.remove('active'));
	const tabLinks = popup.querySelectorAll('.tab-link');
	tabLinks.forEach(link => link.classList.remove('active'));
	const selectedTab = popup.querySelector(`#${tabId}`);
	if (selectedTab) selectedTab.classList.add('active');
	evt.currentTarget.classList.add('active');
}

const apiCallCache = new Set();

function referralLeaderboardTabSwitch(evt, tabId) {
	document.querySelectorAll('.popup-wrapper.is-open .popup').forEach(popup => {
		popup.scrollTo({ top: 0, behavior: 'smooth' });
	});
	const popup = document.getElementById('waitlist-popup');
	const tabContents = popup.querySelectorAll('.tab-content');
	tabContents.forEach(tab => tab.classList.remove('active'));
	const tabLinks = popup.querySelectorAll('.tab-link');
	tabLinks.forEach(link => link.classList.remove('active'));
	popup.querySelector(`#${tabId}`).classList.add('active');
	evt.currentTarget.classList.add('active');

	// api calls 
	if (!apiCallCache.has(tabId)) {
		apiCallCache.add(tabId);
		let apiUrl = '';
		if (tabId === 'referral-tab') {
			apiUrl = `https://development.unboundxinc.us/api/activity-points/web-Referral/share-url?email=${submittedUserEmail}`;
		} else if (tabId === 'leaderboard-tab') {
			apiUrl = `https://development.unboundxinc.us/api/activity-points/web-Referral/leaderboard=${submittedUserEmail}`;
		}

		if (apiUrl) {
			fetch(apiUrl)
				.then(res => res.json())
				.then(data => console.log(`${tabId} API response:`, data))
				.catch(err => console.error(`Error in ${tabId} API call:`, err));
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const currentHash = window.location.hash;
	const urlParams = new URLSearchParams(window.location.search);
	const referralCode = urlParams.get("referral_code");

	if (currentHash === '#join-popup' || referralCode) {
		const popup = document.querySelector("#join-popup.popup-wrapper.js-popup");
		if (popup) {
			popup.classList.add("is-open");
			document.body.classList.add("has-popup-open");
			openWinnerPopup?.('waitlist'); // Optional: call if defined
		}
	}

	if (currentHash === '#winner-popup') {
		const popup = document.querySelector("#winner-popup.popup-wrapper.js-popup");
		if (popup) {
			popup.classList.add("is-open");
			document.body.classList.add("has-popup-open");
		}
	}
});


document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("join-popup");
  const closeBtn = document.getElementById("closePopup");
  const overlay = popup.querySelector(".app-m-overlay");

  function closePopup() {
    popup.classList.remove("is-open");
	document.body.classList.remove("has-popup-open");

  }

  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
  }

  // Overlay click
  if (overlay) {
    overlay.addEventListener("click", closePopup);
  }
});