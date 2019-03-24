/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

})(jQuery);

$(document).ready(function() {

	$(".button").click(function() {
		startRaining(rate_of_rain);
	});

});

var rate_of_rain = 1000;
var logo_batch = 2;
var rain_offset_x = 50;
var rain_offset_y = -200;
var rain_variance = 300;
var min_logo_size = 30;
var logo_size_variance = 10;
var acceleration = 10;
var logo_death_time = 15000;
var logo_refresh_rate = 200;

function startRaining(wait) {
  	rainLogos(Math.floor(logo_batch * Math.random()));
  	setTimeout(function() {
    	startRaining(wait)
  	}, wait);
}

function rainLogos(num) {
  	while(num) {
    	num--;
    	rainLogo({
      		x: -rain_offset_x + Math.floor(Math.random() * (screen.width + 2 * rain_offset_x)),
      		y: rain_offset_y - Math.floor(Math.random() * rain_variance)
    	});
  	}
}

function rainLogo(starting, size) {
  	var size = size ? size : min_logo_size + Math.floor(Math.random() * logo_size_variance);
  	var logo = new Logo(starting, size, acceleration);
  	logo.fall();
  	setTimeout(function() {
    	logo.die()
 	}.bind(this), logo_death_time);
  	return logo;
}

window.rainLogo = rainLogo;

function Logo(starting, size, acceleration) {
  	this.x = starting.x;
  	this.y = starting.y;
  	this.size = size;
  	this.acceleration = acceleration;
  	this.velocity_x = 10;
  	this.velocity_y;
  	this.time = 0;
  	this.img;
  	this.moving = true;
  	this.time_interval = logo_refresh_rate;
  	this.img = $(loadLogo());
  	$("body").append(this.img);
  	this.img.css({
	    zIndex: Math.floor(Math.random() * 4),
	    transition: "0.3s linear",
	    width: this.size,
	    position: "fixed",
	    top: this.y,
	    left: this.x
  	});
}

function loadLogo() {
	var rnd = Math.floor(Math.random()*3);
	if(rnd == 0) {
		return "<img class='spin' src='images/small-logo.png'>";
	}
	else if(rnd == 1){
		return "<img class='spin' src='images/chu.jpg'>";
	}
	else {
		return "<img class='spin' src='images/chuthink.jpg'>";
	}
}

Logo.prototype.fall = function() {

  	this.img.css({
    	top: this.calcY(),
    	left: this.calcX()
  	});

  	if (this.moving) {
	    setTimeout(function() {
	      	this.fall();
   		}.bind(this), this.time_interval);
  	}
}

Logo.prototype.calcY = function() {

	this.y = 1/2 * this.acceleration * (this.time * this.time);
  	this.time += this.time_interval * 0.001;
  	return this.y;
}

Logo.prototype.calcX = function() {
	if(this.x + this.velocity_x < 0 || this.x + this.velocity_x > screen.width) {
		this.velocity_x *= -1;
	}

	this.x = this.x + this.time*this.velocity_x;

	if(this.x < 0 - this.width*1.2) this.x = 0;
	else if(this.x + this.width*1.2 > screen.width) this.x = screen.width - this.width*1.2;

 	return this.x;
}

Logo.prototype.die = function() {
	this.img.remove();
  	this.moving = false;
}