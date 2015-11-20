$(document).ready(function() {
    $.getJSON('/issues', function(data) {
        var i, 
            unresolved = '',
            resolved = '';

        for (i = 0; i < data.length; i++) {
            if (data[i].state === 0) {
                unresolved += '<div id="issue-' + data[i].id + '" class="issue-container unresolved-issue" draggable="true">' + data[i].text + '</div>';
            } else if (data[i].state === 1) {
                resolved += '<div id="issue-' + data[i].id + '" class="issue-container">' + data[i].text + '</div>';
            }
        }
        $('#unresolved-container').append(unresolved);
        $('#resolved-container').append(resolved);

        $('.unresolved-issue').on('dragstart', Closeout.beginDrag);
    });

    $('#new-issue-form').submit(function(){
        var $this = $(this);

        $.ajax({
          url: $this.attr('action'),
          type: 'POST',
          dataType: 'json',
          data : $this.serialize(),
          success: Closeout.issueCreated
        });
        return false;
    });
});

var Closeout = {};

Closeout.beginDrag = function(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    $('#resolved-container').addClass('resolved-focus');
};

Closeout.endDrag = function(ev) {
    var data = ev.dataTransfer.getData("text"),
        el = document.getElementById(data);

    ev.preventDefault();
    
    $.ajax({
        url: '/issues/' + data.replace('issue-', ''),
        type: 'PUT',
        dataType: 'json',
        data : {issue: {state: 1}},
        success: function() {
            ev.target.appendChild(el);
        }
    });

    $('#resolved-container').removeClass('resolved-focus');
};

Closeout.allowDrop = function(ev) {
    ev.preventDefault();
};

Closeout.showPopup = function() {
    $('#overlay').show();
    $('#create-popup').show();
};

Closeout.hidePopup = function() {
    $('#overlay').hide();
    $('#create-popup').hide();
    $('#issue_text').val('');
};

Closeout.issueCreated = function(data) {
    if (data && data.id) {
        $('#unresolved-container').append('<div id="issue-' + data.id + '" class="issue-container unresolved-issue" draggable="true">' + data.text + '</div>');
        $('.unresolved-issue').off('dragstart').on('dragstart', Closeout.beginDrag);
        Closeout.hidePopup();
    }
};

Closeout.clearList = function() {
    $.ajax({
        url: '/destroyAll',
        type: 'DELETE',
        dataType: 'json'
    });
    $('#resolved-container .issue-container').remove();
};

