$(function() {
  $('.emoji-autocomplete').textcomplete([
    {
      match: /\B:([\-+\w]*)$/,
      search: function (term, callback) {
        callback($.map(base_emojis, function (emoji) {
          return emoji.indexOf(term) === 0 ? emoji : null;
        }));
      },
      template: function (value) {
        return '<img src="/images/emoji/' + value + '.png" class="emoji"></img>' + value;
      },
      replace: function (value) {
        return ':' + value + ': ';
      },
      index: 1
    }
  ]);
});
