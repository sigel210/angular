<?php

namespace app\http\middleware;

class Auth {
    public function handle($request, \Closure $next) {
        $request->hello = "hello Python";
        return $next($request);
    }
}
