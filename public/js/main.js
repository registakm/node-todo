$(document).ready(function() {
	var alert = $('.alert');
	alert.hide();
	alert.on('error', function (evt, data) {
		alert.html(data);
		alert.addClass('alert-danger');
		alert.show();
	});
	alert.on('success', function (evt, data) {
		alert.html(data);
		alert.addClass('alert-info');
		alert.show();
	});
	$('.task-delete').click(function (evt) {
		$target = $(evt.target);
		$.ajax({
			type:'DELETE',
			url: '/tasks/' + $target.attr('data-task-id'),
			data: {
				_csrf: $target.attr('data-csrf')
			},
			success: function (res) {
				$target.parent().parent().remove();
				alert.trigger('success', 'Task was removed');
			},
			error: function (err) {
				alert.trigger('error', err);
			}
		});
	});
});