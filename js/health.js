SERVERS = {
	'communicator': {
		'dev': 'https://communicator.tripitlabs.io/status',
		'prod': 'https://us-communicator.tripit.io/status'
	},
	'devicerator': {
		'dev': 'https://devicerator.tripitlabs.io/status',
		'prod': 'https://us-devicerator.tripit.io/status'
	},
	'authenticator': {
		'dev': 'https://authenticator.tripitlabs.io/status',
		'prod': 'https://us-authenticator.tripit.io/status'
	},
	'monitorator': {
		'dev': 'https://monitorator.tripitlabs.io/status',
		'prod': 'https://us-monitorator.tripit.io/status'
	},
	'navigator': {
		'dev': 'https://navigator.tripitlabs.io/status',
		'prod': 'https://us-navigator.tripit.io/status'
	}
};

var getLabel = function (type, label) {
	return '<label class="label label-' + type + '">' + label + '</label>';
}

var getStatusLabel = function (statusCode) {
     label = '&nbsp;';
	type = 'danger';
	if (statusCode >= 200 && statusCode < 300) {
		type = 'success';
	}
	if (statusCode >= 300 && statusCode < 400) {
		type = 'info';
	}
	if (statusCode >= 400 && statusCode < 500) {
		type = 'warning';
	}
	return getLabel(type, label);
};

var getServerStatus = function (id, type, url) {
	$.ajax({
        type: "GET",
        dataType: 'json',
        url: 'https://crossorigin.me/' + url,
        crossDomain: true,
complete: function (data, xhr) {
console.log(data);
$('#' + id + ' .' + type).html(getStatusLabel(data.status));
}});
}

var healthCheck = function () {
	var $target = $('#health-check'),
		content = '',
		i;

	$target.html('Loading...');

	content = '<table class="table table-hover table-condensed"><tr><th>Server</th><th>Dev</th><th>Prod</th></tr>';

	for (var name in SERVERS) {
		var devStatus = getLabel('info', '...'),
			prodStatus = getLabel('info', '...');

		content += '<tr id=' + name + '><td>' + name + '</td><td class="dev">' + devStatus + '</td><td class="prod">' + prodStatus + '</td></tr>';

	}
	
	content += '</table>';

	$target.html(content);

	for (var name in SERVERS) {
		getServerStatus(name, 'dev', SERVERS[name].dev);
		getServerStatus(name, 'prod', SERVERS[name].prod);
	}
};

var handleClickEvent = function ($sender) {
	var clickType = $sender.attr('data-event-type');
	if (clickType == 'health-check') {
		healthCheck();
	}
};

$(document).ready(function () {
	$('[data-event]').each(function (e) {
		var $this = $(this),
			eventType = $this.attr('data-event');

		if (eventType == 'click') {
			$this.click(function (e) {
				e.preventDefault();
				handleClickEvent($this);
			});
		}
	});
	healthCheck();
});
