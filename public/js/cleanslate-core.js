/*!
 * cleanslate core
 *
 * currently covers:
 *  - tabs (open tab is bookmarkable, can't be used with other things that rely on hash)
 *  - sortable tables (just updates the querystring for server-side sorting)
 *
 */
cleanslate = {
  log : function(){
    try {
      console.log.apply(window, arguments);
    } catch(e) {
      cleanslate.backlog.push(arguments);
    }
  },
  backlog : [],
  init: function(){


    $('a.login').click(function(e){
      console.log('here');
      e.preventDefault();
      $('#user-login-form').toggle();
    });

    $('#user-login-form').find('.close').click(function(){
      $('#user-login-form').toggle();
    });

    // FLASH MESSAGING
    (function doFlashMessage(){
      var msg = $.cookie('flashMessage');
      if(msg){
        // show the message
        $('#messages').html(msg);
        // make sure we see the message.
        setTimeout(function(){ $(window).scrollTop(0); }, 500);
        // clear the message - todo: this does not clear the cookie value!
        $.cookie('flashMessage', null);
      }
    })();


    // TABS
    // introduced for admin form tabs, but general-purpose enough to belong here.
    (function doTabs(){
      var tabIndex = 0;
      if(/#tab=/.test(location.hash)){
        var hashTabIndex = $('.tab-content').index( $(location.hash.replace('tab=',''))[0] );
        if(hashTabIndex > 0){
          tabIndex = hashTabIndex;
        }
      }
      $(".tab-content").hide().eq(tabIndex).show();
      $("ul.tabs li").eq(tabIndex).addClass("active");
      $(".tab-content h3").remove();
      $("ul.tabs a").click(function(e){
        e.preventDefault();
        var tab = $(this);
        var href = tab.attr('href');
        tab.closest('ul').find('li').removeClass("active");
        tab.parent().addClass("active");
        $(".tab-content").hide();
        $(href).fadeIn(200);
        location.hash = '#tab=' + href.split('#')[1];
      });
    })();

    // Vertical tabs
    $(".vertical-tab-content").hide().eq(0).show();
    $("ul.vertical-tabs li:first").addClass("active");
    $("ul.vertical-tabs a").click(function() {
      var tab = $(this);
      var href = tab.attr('href');
      cleanslate.log(href);
      tab.closest('ul').find('li').removeClass("active");
      tab.parent().addClass("active");
      $(".vertical-tab-content").hide();
      $(href).fadeIn(200);
      return false;
    });


    // TABLES
    $("th.sortable").click(function() {

      var name = $(this).attr('name');

      // Consider the current URL
      var l = location;
      var baseUrl = l.protocol + '//' + l.hostname + ':' + l.port + l.pathname;
      var params = l.search ? l.search.substring(1).split('&') : [];

      // Update the params
      var found = false;
      var newParams = [];
      $.each(params, function(i, param) {
        if(param.indexOf('sortBy='+name+',')===0){
          found = true;
          var paramSplit = param.split(',');
          // asc->desc (and implicitly, desc->none, by not pushing it to the newParams)
          if(paramSplit[1] == 'asc'){
            newParams.push(paramSplit[0] + ',desc');
          }
        } else {
          newParams.push(param);
        }
      });

      // New (none->asc)
      if(!found) {
        newParams.push('sortBy=' + name + ',asc');
      }

      var newSearch = newParams.join('&');

      location = baseUrl + (newSearch ? '?'+newSearch : '') + l.hash;

    });


    // DOUBLE CLICK TO EDIT CONTENT
    // todo - should check if user.isAdmin, or if the user is the author of the content
    $('.content-block').dblclick(function() {
      var id = this.id, l = location;
      if(id) {
        l.href = "/content/edit/" + id + "?returnTo=" + l.pathname + l.search + l.hash;
      }
    });


    // REMOVE ANNOYING TITLE TOOLTIPS FROM MENUS
    $('.menu a').each(function(i, node) {
      node.title = "";
    });


  } // end of cleanslate.init

}; //end of cleanslate

// since the script block is after all content, call cleanslate.init now
cleanslate.init();
