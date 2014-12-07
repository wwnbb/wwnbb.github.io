angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('auth\templates\profile.html',
        "<div class=\"row\">\r\n  <div class=\"six columns\">\r\n  \t<p>\r\n  \t{@user.email@}\r\n  \t</p>\r\n  \t<p>\r\n  \t{@user.last_login@}\r\n  \t</p>\r\n  \t<p>\r\n  \t{@user.first_name@}\r\n  \t</p>\r\n  \t<p>\r\n  \t{@user.last_name@}\r\n  \t</p>\r\n\t</div>\r\n</div>");
}]);