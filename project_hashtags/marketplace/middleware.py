# marketplace/middleware.py
from django.utils.deprecation import MiddlewareMixin

class CsrfExemptMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # List of paths to exempt from CSRF check
        exempt_paths = [
            r'^/accounts/login/$',  # Note: Using raw string for regex
            r'^/accounts/password_change/$',  # Note: Using raw string for regex
            r'^/accounts/password_change/done/$',  # Note: Using raw string for regex
            r'^/accounts/password_reset/$',  # Note: Using raw string for regex
            r'^/accounts/password_reset/done/$',  # Note: Using raw string for regex
            r'^/accounts/reset/(?P<uidb64>[^/]+)/(?P<token>[^/]+)/$',  # Note: Using raw string for regex
            r'^/accounts/reset/done/$',  # Note: Using raw string for regex
            r'^/accounts/logout/$'  # Note: Using raw string for regex
        ]

        if request.path in exempt_paths:
            setattr(request, '_dont_enforce_csrf', True)
